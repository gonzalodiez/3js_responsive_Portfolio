import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
} from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { Avatar } from "./Avatar";
import { Office } from "./Office";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { framerMotionConfig } from "./Config";
import { useScroll } from "@react-three/drei";
import { Projects } from "./Projects";
import { Background } from "./Background";

export const Experience = (props) => {
  
  const {menuOpened} = props ;
  const {viewport} = useThree();
  const data = useScroll();
  const [section, setSection] = useState(0);

  const isMobile = window.innerWidth < 768;
  const responsiveRatio = viewport.width / 10;
  const officeScaleRatio = Math.max(0.5 , Math.min(0.9 * responsiveRatio , 0.9) );
  const characterScaleRatio = Math.max(0.7 , Math.min(1.155 * responsiveRatio , 1.155) );

  const cameraPositionX = useMotionValue();
  const cameraLookAtX = useMotionValue();

  useEffect (() =>{
    animate(cameraPositionX, menuOpened ? -5 : 0, {
      ...framerMotionConfig,
    });
    animate(cameraLookAtX, menuOpened ? 5 : 0, {
      ...framerMotionConfig,
    });
  }, [menuOpened]);

  const CharacterContainerAboutRef = useRef();

  const [characterAnimation, setCharacterAnimation]=useState("Typing");

  useEffect(() => {
    setCharacterAnimation("Falling");
    setTimeout(() => {
      setCharacterAnimation(section === 0 ? "Typing" : "Standing");
    }, 600);
  },[section]);

  const characterGroup = useRef() ;

  useFrame((state) => {
    const curSection = Math.floor(data.scroll.current * data.pages);

    //let curSection = Math.floor(data.scroll.current * data.pages);

    if (curSection > 3) {
      curSection = 3;
    }

    if (curSection !== section) {
      setSection(curSection);
    }

    state.camera.position.x = cameraPositionX.get();
    state.camera.lookAt(cameraLookAtX.get(), 0, 0);
   

    if (section === 0) {
      CharacterContainerAboutRef.current.getWorldPosition(
        characterGroup.current.position
        );
    }
  });


  return (
    <>
      <Background />
      <motion.group 
      ref={characterGroup}
      rotation={[-3.1415926535897927, 1.3973981633974495, 3.1415926535897927]}
      scale={[1.272/1.155 * characterScaleRatio, 1.272/1.155 * characterScaleRatio, 1.272/1.155 * characterScaleRatio]}
      animate={"" + section}
      transition={{
        duration: 0.6,
      }}
      variants={{
        0: {
          scaleX: characterScaleRatio,
          scaleY: characterScaleRatio,
          scaleZ: characterScaleRatio,
        },
        1: {
          y: -viewport.height ,
          x: 0,
          z: 4,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        }
      }}
      >
        <Avatar animation={characterAnimation} wireFrame={section === 1} />
      </motion.group>
      <ambientLight intensity={1} />
      <motion.group
        position={[isMobile ? 0 : 1.5 * officeScaleRatio,isMobile ? -viewport.height/7 : 2, 3]}
        scale={[officeScaleRatio,officeScaleRatio,officeScaleRatio]}
        rotation-y={-Math.PI / 4}
        animate={{
          y: isMobile ? -viewport.height/7 : 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <Office section={section} />
        <group 
          ref={CharacterContainerAboutRef}
          name="CharacterSpot"
          position={[-0.2, 0.05, -0.56]}
          rotation={[-Math.PI, 0.612, -Math.PI]}
        >
        </group>
      </motion.group>


      {/* SKILLS */}
      <motion.group   
      position={[0, -1.5, -10]}
      animate = {{
        z: section === 1 ? 0 : -10,
        y: section === 1 ? -viewport.height : 1-5,
      }}
      >
        <directionalLight position={[-5, 3, 5]} intensity={0.4} />
        <Float>
          <mesh position={[1, -3, -15]} scale={[2, 2, 2]}>
            <sphereGeometry />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={0.4}
              speed={4}
              color={"red"}
            />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[3, 3, 3]} position={[3, 1, -18]}>
            <sphereGeometry />
            <MeshWobbleMaterial
              opacity={0.8}
              transparent
              distort={1}
              speed={5}
              color="yellow"
            />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[1.4, 1.4, 1.4]} position={[-3, -1, -11]}>
            <boxGeometry />
            <MeshWobbleMaterial
              opacity={0.8}
              transparent
              factor={1}
              speed={5}
              color={"blue"}
            />
          </mesh>
        </Float>
      </motion.group>
      <Projects />
    </>
  );
};
