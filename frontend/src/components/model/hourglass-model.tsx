import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

const Hourglass: React.FC = () => {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF('/scene.gltf') as any;
    const { actions, mixer } = useAnimations(animations, group);

    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => {
                if (action) {
                    action.setLoop(THREE.LoopRepeat, Infinity); // Repeat the animation indefinitely
                    action.clampWhenFinished = true; // Ensure the animation does not blend back to the start
                    action.timeScale = 0.3; // Adjust the speed of the animation (0.3 is 30% of the speed)
                    action.play();
                }
            });
        }
    }, [actions]);

    useFrame((state, delta) => {
        mixer.update(delta);
    });

    return (
        <primitive object={scene} ref={group} />
    );
};

const CameraControls: React.FC = () => {
    const { camera, size } = useThree();

    // Change camera position
    useEffect(() => {
        if (size.width <= 768) { // Adjust based on your breakpoint
            camera.position.set(0, 0, 5); // Set camera position for small screens
        } else {
            camera.position.set(0, 0, 5); // Set camera position for large screens
        }
    }, [camera, size]);

    return null;
};

const CurrentTimeText: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Text 
            position={[0, -2, -3]} // Adjust the position as needed
            fontSize={1} // Adjust the size as needed
            color="#7d000c" // Adjust the color as needed
            anchorX="center" 
            anchorY="middle"
            // fontWeight={600}
            receiveShadow
            castShadow
        >
            {currentTime}
        </Text>
    );
};

const HourglassModel: React.FC = () => {
    return (
        <Canvas 
            gl={{ pixelRatio: Math.min(window.devicePixelRatio, 2),antialias:false, powerPreference: "low-power" }}
            camera={{ fov: 75, position: [0, 0, 5] }}
        >
             <ambientLight color={0x1562ab} intensity={10} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            <Hourglass />
            <CurrentTimeText />
            <CameraControls />
            <OrbitControls />
            <Environment backgroundIntensity={0.8} environmentIntensity={0.5} files={'/scene_hdri.exr'} />
        </Canvas>
    );
};

export default HourglassModel;
