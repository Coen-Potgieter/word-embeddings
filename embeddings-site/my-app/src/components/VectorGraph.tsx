import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { Vector3, ArrowHelper } from "three";
import * as tf from "@tensorflow/tfjs";
import { useEmbeddings } from "../context/embeddings";
import { applyPCA } from "../helper-funcs.ts";

type Vec = number[] | tf.Tensor1D;

type VectorProps = {
  vec: Vec;
  color?: string;
  width?: number;
  animate?: boolean;
};

const toArray = (v: Vec): [number, number, number] => {
  if (Array.isArray(v)) return v as [number, number, number];
  return v.arraySync() as [number, number, number];
};

const VectorArrow: React.FC<VectorProps> = ({
  vec,
  color = "red",
  animate = false,
}) => {
  const vecArray = toArray(vec);
  const direction = new Vector3(...vecArray).normalize();
  const origin = new Vector3(0, 0, 0);

  // Create the ArrowHelper only when direction or color changes
  const arrow = useMemo(() => {
    const helper = new ArrowHelper(
      direction,
      origin,
      animate ? 0 : 1,
      color,
      0.2,
      0.1,
    );
    return helper;
  }, [direction.x, direction.y, direction.z, color]);

  const arrowRef = useRef<ArrowHelper>(arrow);
  const progress = useRef(0);

  // Reset progress whenever `animate` flips
  useEffect(() => {
    progress.current = animate ? 0 : 1;
    arrow.setLength(progress.current, 0.2, 0.1);
  }, [animate, arrow]);

  useFrame((_, delta) => {
    if (!animate) return;
    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta, 1);
      arrow.setLength(
        progress.current,
        progress.current * 0.2,
        progress.current * 0.1,
      );
    }
  });

  return <primitive object={arrow} />;
};

type GraphProps = {
  words: string[];
  size?: number;
  background?: string;
  axisColor?: string;
  axisWidth?: number;
  gridSize?: number;
};

const Axis = ({
  color = "#666",
  width = 1,
  length = 2,
}: {
  color?: string;
  width?: number;
  length?: number;
}) => {
  return (
    <>
      {/* X Axis */}
      <Line
        points={[
          [0, 0, 0],
          [length, 0, 0],
        ]}
        color={color}
        lineWidth={width}
      />
      {/* Y Axis */}
      <Line
        points={[
          [0, 0, 0],
          [0, length, 0],
        ]}
        color={color}
        lineWidth={width}
      />
      {/* Z Axis */}
      <Line
        points={[
          [0, 0, 0],
          [0, 0, length],
        ]}
        color={color}
        lineWidth={width}
      />
    </>
  );
};

export const VectorGraph: React.FC<GraphProps> = ({
  words = ["", ""],
  size = 500,
  background = "#123456",
  axisColor = "#888",
  axisWidth = 1,
  gridSize = 10,
}) => {
  const { embeddings } = useEmbeddings();
  type vecType = ({
    vec: tf.Tensor1D;
    color: string;
    animate: boolean;
  } | null)[];

  const [plottedVecs, setPlottedVecs] = useState<vecType>([null, null]);

  useEffect(() => {
    if (words[0] != "") {
      applyPCA(tf.tensor1d(embeddings.get(words[0]))).then((word1) => {
        console.log("Updated");
        setPlottedVecs((oldState) => {
          const newState = [...oldState];
          newState[0] = {
            vec: word1,
            color: "#ff0000",
            animate: true,
          };
          return newState;
        });
      });
    } else {
      setPlottedVecs((oldState) => {
        const newState = [...oldState];
        newState[0] = null;
        return newState;
      });
    }
    if (words[1] != "") {
      applyPCA(tf.tensor1d(embeddings.get(words[1]))).then((word2) => {
        setPlottedVecs((oldState) => {
          const newState = [...oldState];
          newState[1] = {
            vec: word2,
            color: "#0000ff",
            animate: true,
          };
          return newState;
        });
      });
    } else {
      setPlottedVecs((oldState) => {
        const newState = [...oldState];
        newState[1] = null;
        return newState;
      });
    }
  }, [words[0], words[1]]);

  let backgroundGiven = true;
  if (background === "#123456") {
    backgroundGiven = false;
  }

  const canvasCompProp = !background
    ? {
        camera: { position: [1.5, 2, 3] },
        gl: { alpha: true },
        style: { background: "transparant" },
      }
    : { camera: { position: [0.7, 1.2, 2.2] } };
  return (
    <div style={{ width: size, height: size }}>
      <Canvas {...canvasCompProp}>
        {backgroundGiven && <color attach="background" args={[background]} />}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <gridHelper args={[gridSize, gridSize]} />
        <OrbitControls makeDefault />
        <Axis color={axisColor} width={axisWidth} length={1.5} />

        {plottedVecs.map((v, i) => {
          if (!v) return null;
          return <VectorArrow key={i} {...v} />;
        })}
      </Canvas>
    </div>
  );
};
