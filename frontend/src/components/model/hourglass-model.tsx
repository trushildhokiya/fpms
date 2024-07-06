import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment, Loader } from '@react-three/drei';
import * as THREE from 'three';

const Hourglass: React.FC = () => {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF('/scene.gltf') as any;
    const { actions, mixer } = useAnimations(animations, group);
    const [modelLoaded, setModelLoaded] = useState(false);

    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => {
                if (action) {
                    action.setLoop(THREE.LoopRepeat, Infinity); // Repeat the animation indefinitely
                    action.clampWhenFinished = true; // Ensure the animation does not blend back to the start
                    action.timeScale = 0.3; // Adjust the speed of the animation (0.5 is half speed)
                    action.play();
                }
            });
        }
    }, [actions]);

    useFrame((state, delta) => {
        mixer.update(delta);
    });

    return (
        <>
            {!modelLoaded && <Loader />} {/* Display loader while model is loading */}
            <primitive object={scene} ref={group} onObject3DReady={() => setModelLoaded(true)} />
            <Environment backgroundIntensity={1} environmentIntensity={0.5} files={'/scene_hdri.exr'} />
        </>
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

const HourglassModel: React.FC = () => {
    return (
        <Canvas>
            <ambientLight color={0x1562ab} intensity={10} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            <Hourglass />
            <CameraControls />
            <OrbitControls />
        </Canvas>
    );
};

export default HourglassModel;
