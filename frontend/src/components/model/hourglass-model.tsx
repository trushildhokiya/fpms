import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment, Text, Preload } from '@react-three/drei';
import { LoopRepeat, Group } from 'three';

// Preload the model
useGLTF.preload('/scene.gltf', true);

const Hourglass = () => {
    const group = useRef<Group>(null);
    const { scene, animations } = useGLTF('/scene.gltf', true) as any; // Enable Draco compression
    const { actions, mixer } = useAnimations(animations, group);

    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => {
                if (action) {
                    action.setLoop(LoopRepeat, Infinity); // Repeat the animation indefinitely
                    action.clampWhenFinished = true; // Ensure the animation does not blend back to the start
                    action.timeScale = 0.1; // Adjust the speed of the animation (0.3 is 30% of the speed)
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

const CameraControls = () => {
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

const CurrentTimeText = () => {
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
        >
            {currentTime}
        </Text>
    );
};

const HourglassModel = () => {
    return (
        <Canvas
            performance={{ min: 0.5 }}
            gl={{ pixelRatio: Math.min(window.devicePixelRatio, 2), antialias: true }}
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
            <Preload all />
        </Canvas>
    );
};

export default HourglassModel;
