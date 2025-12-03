import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Mesh, RingGeometry, MeshBasicMaterial, DoubleSide } from 'three';
import { useUI } from '@/contexts/UIContext';
import { celestialBodies } from '@/utils/constants';

const ECLIPSE_PHASE_DURATION = 12000; // 12 seconds per phase

interface CameraPosition {
  position: Vector3;
  target: Vector3;
}

const SOLAR_ECLIPSE_POSITIONS: CameraPosition[] = [
  { position: new Vector3(0, 20, 40), target: new Vector3(0, 0, 0) },
  { position: new Vector3(25, 5, 0), target: new Vector3(15, 0, 0) },
  { position: new Vector3(16, 2, 3), target: new Vector3(15, 0, 0) },
  { position: new Vector3(14, 1, 1), target: new Vector3(0, 0, 0) },
  { position: new Vector3(15, 8, 5), target: new Vector3(15, 0, 0) },
];

const LUNAR_ECLIPSE_POSITIONS: CameraPosition[] = [
  { position: new Vector3(0, 20, 40), target: new Vector3(0, 0, 0) },
  { position: new Vector3(25, 5, 0), target: new Vector3(15, 0, 0) },
  { position: new Vector3(16, 2, 3), target: new Vector3(15, 0, 0) },
  { position: new Vector3(14, 1, 1), target: new Vector3(15, 0, 0) },
  { position: new Vector3(15, 8, 5), target: new Vector3(15, 0, 0) },
];

const SOLAR_ECLIPSE_INFO = [
  {
    title: 'Fase 1: Preparando (Alinhamento)',
    desc: 'Começamos de longe para que você possa ver o Sol, a Terra e a Lua se alinharem. Pense nisso como três amigos em fila — da nossa perspectiva, eles parecem perfeitos quando se alinham. Isso ajuda você a ver como o eclipse solar pode acontecer.',
  },
  {
    title: 'Fase 2: Primeiro Contato (Lua se Aproxima)',
    desc: 'Agora a Lua se move lentamente entre a Terra e o Sol. Você verá o Sol começar a parecer um pouco mordido — isso é a Lua o cobrindo. Tome seu tempo, observe o movimento.',
  },
  {
    title: 'Fase 3: Aproximando-se da Totalidade (Sombra Cresce)',
    desc: 'A sombra da Lua se estende sobre a Terra. A luz mudará e as coisas ficarão mais escuras — como quando nuvens passam sobre o sol. Vamos nos aproximar para que você possa sentir a escala.',
  },
  {
    title: 'Fase 4: Eclipse Solar Total (A Coroa)',
    desc: 'Por um breve momento mágico o Sol está escondido e podemos ver a coroa — um belo anel brilhante. É uma das vistas mais impressionantes do espaço. Vamos desacelerar para que você possa aproveitar cada segundo.',
  },
  {
    title: 'Fase 5: A Sombra Passa (Fim)',
    desc: 'A Lua continua e a luz solar retorna. A sombra varre e tudo volta ao normal. Vamos nos afastar para que você possa ver a cena completa novamente.',
  },
];

const LUNAR_ECLIPSE_INFO = [
  {
    title: 'Fase 1: Preparando (Alinhamento)',
    desc: 'Começamos de longe para que você possa ver o Sol, a Terra e a Lua se alinharem. Pense nisso como três amigos em fila — mas desta vez a Terra está no meio, bloqueando a luz solar de alcançar a Lua. Isso ajuda você a ver como o eclipse lunar pode acontecer.',
  },
  {
    title: 'Fase 2: Entrando na Sombra da Terra (Penumbra)',
    desc: 'Agora a Lua se move lentamente para a sombra da Terra. Você verá a Lua começar a parecer um pouco mais escura — isso é a sombra da Terra a cobrindo. A Lua não desaparece, apenas fica mais escura conforme a Terra bloqueia a luz solar.',
  },
  {
    title: 'Fase 3: Sombra Mais Profunda (Umbra se Aproxima)',
    desc: 'A Lua se move mais profundamente na sombra da Terra. A luz mudará e a Lua ficará muito mais escura — como quando você fica na sombra de alguém. Vamos nos aproximar para que você possa ver como a Terra bloqueia completamente a luz solar direta.',
  },
  {
    title: 'Fase 4: Eclipse Lunar Total (Sombra Completa)',
    desc: 'Por um momento a Lua está completamente na sombra da Terra! Mesmo que nenhuma luz solar direta a alcance, a Lua não desaparece completamente. Alguma luz ainda a alcança após se curvar através da atmosfera da Terra, por isso ainda podemos vê-la fracamente.',
  },
  {
    title: 'Fase 5: Saindo da Sombra (Fim)',
    desc: 'A Lua sai da sombra da Terra e retorna à sua cor brilhante normal. A sombra passa e tudo volta ao normal. Vamos nos afastar para que você possa ver a cena completa novamente.',
  },
];

export default function EclipseTour() {
  const { state: uiState, updateEclipseProgress, stopEclipseTour } = useUI();
  const { camera, scene } = useThree();
  const timerRef = useRef(0);
  const phaseRef = useRef(0);
  const coronaRef = useRef<Mesh | null>(null);
  const originalEarthAngleRef = useRef<number | null>(null);

  useEffect(() => {
    if (!uiState.isEclipseTourActive) {
      // Cleanup
      if (coronaRef.current) {
        scene.remove(coronaRef.current);
        coronaRef.current = null;
      }
      timerRef.current = 0;
      phaseRef.current = 0;
      return;
    }

    // Create corona effect
    const coronaGeometry = new RingGeometry(5.2, 8, 32);
    const coronaMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: DoubleSide,
    });
    const corona = new Mesh(coronaGeometry, coronaMaterial);
    corona.position.set(0, 0, 0);
    scene.add(corona);
    coronaRef.current = corona;

    // Store original positions (simplified - would need to track actual planet/moon refs)
    const earthBody = celestialBodies.find((b) => b.name === 'Terra');
    if (earthBody) {
      originalEarthAngleRef.current = earthBody.initialAngle;
    }

    return () => {
      if (coronaRef.current) {
        scene.remove(coronaRef.current);
        coronaRef.current = null;
      }
    };
  }, [uiState.isEclipseTourActive, scene]);

  useFrame((_, delta) => {
    if (!uiState.isEclipseTourActive || !uiState.eclipseTourType) return;

    timerRef.current += delta * 1000; // Convert to milliseconds

    // Switch phases
    if (timerRef.current >= ECLIPSE_PHASE_DURATION) {
      phaseRef.current++;
      timerRef.current = 0;

      if (phaseRef.current >= SOLAR_ECLIPSE_POSITIONS.length) {
        stopEclipseTour();
        return;
      }
    }

    // Update progress and phase info
    const progress = (timerRef.current / ECLIPSE_PHASE_DURATION) * 100;
    const positions = uiState.eclipseTourType === 'solar' ? SOLAR_ECLIPSE_POSITIONS : LUNAR_ECLIPSE_POSITIONS;
    const info = uiState.eclipseTourType === 'solar' ? SOLAR_ECLIPSE_INFO : LUNAR_ECLIPSE_INFO;

    if (phaseRef.current < info.length) {
      updateEclipseProgress(
        progress,
        info[phaseRef.current].title,
        info[phaseRef.current].desc
      );
    }

    // Smooth camera transition
    const currentPhase = positions[phaseRef.current];
    const smoothProgress = 0.5 * (1 - Math.cos((timerRef.current / ECLIPSE_PHASE_DURATION) * Math.PI));

    if (phaseRef.current > 0) {
      const prevPhase = positions[phaseRef.current - 1];
      camera.position.lerpVectors(prevPhase.position, currentPhase.position, smoothProgress);
      
      const lerpTarget = new Vector3();
      lerpTarget.lerpVectors(prevPhase.target, currentPhase.target, smoothProgress);
      camera.lookAt(lerpTarget);
    } else {
      camera.position.lerp(currentPhase.position, 0.02);
      camera.lookAt(currentPhase.target);
    }

    // Eclipse effects based on phase
    if (coronaRef.current) {
      const phaseProgress = timerRef.current / ECLIPSE_PHASE_DURATION;
      const material = coronaRef.current.material;
      const meshBasicMaterial = Array.isArray(material) ? material[0] : material;
      
      if (meshBasicMaterial && 'opacity' in meshBasicMaterial) {
        switch (phaseRef.current) {
          case 0:
            meshBasicMaterial.opacity = 0;
            break;
          case 1:
            // Dim ambient light slightly
            break;
          case 2:
            meshBasicMaterial.opacity = phaseProgress * 0.3;
            coronaRef.current.lookAt(camera.position);
            break;
          case 3:
            // Totality - show corona
            meshBasicMaterial.opacity = 0.85;
            coronaRef.current.lookAt(camera.position);
            break;
          case 4:
            meshBasicMaterial.opacity = 0.85 - (phaseProgress * 0.9);
            break;
        }
      }
    }
  });

  return null;
}

