import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Environment, PresentationControls, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

function Card() {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.cos(time / 2) / 8, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, Math.sin(time / 4) / 4, 0.1);
  });

  return (
    <Float
      speed={2} 
      rotationIntensity={1} 
      floatIntensity={1}
    >
      <mesh ref={meshRef} castShadow position={[0, 0, 0]}>
        {/* Main Card Body */}
        <boxGeometry args={[4, 2.5, 0.1]} />
        <meshPhysicalMaterial
          color={new THREE.Color("#0A0A0F")}
          metalness={0.8}
          roughness={0.15}
          envMapIntensity={3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          opacity={0.9}
          transparent
        />

        {/* Holographic Stripe */}
        <mesh position={[-1.5, 0, 0.051]}>
          <planeGeometry args={[0.5, 2.5]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.6}
            metalness={1}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            color={new THREE.Color("#4f46e5")}
            side={THREE.DoubleSide}
            envMapIntensity={4}
          />
        </mesh>

        {/* Pass Details Layer */}
        <mesh position={[0.5, 0, 0.051]}>
          <planeGeometry args={[2.5, 2]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.15}
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            color={new THREE.Color("#ffffff")}
            side={THREE.DoubleSide}
            envMapIntensity={3}
          />
        </mesh>

        {/* Border Glow */}
        <mesh position={[0, 0, -0.051]}>
          <planeGeometry args={[4.1, 2.6]} />
          <meshBasicMaterial
            color={new THREE.Color("#3b82f6")}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Soccer Ball Icon */}
        <mesh position={[-1.5, 0.7, 0.052]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color={new THREE.Color("#ffffff")}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Text Elements */}
        <Text
          position={[0.5, 0.4, 0.052]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          PREMIUM PASS
        </Text>

        <Text
          position={[0.5, 0, 0.052]}
          fontSize={0.15}
          color="#a0aec0"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          2024 SEASON
        </Text>

        <Text
          position={[0.5, -0.4, 0.052]}
          fontSize={0.12}
          color="#718096"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          #0123456789
        </Text>
      </mesh>
    </Float>
  );
}

export default function ThreeDCard() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      position: 'relative'
    }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          inset: 0
        }}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        
        <PresentationControls
          global
          rotation={[0.13, 0.1, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Card />
        </PresentationControls>

        <Environment preset="city" />
      </Canvas>
    </div>
  );
} 