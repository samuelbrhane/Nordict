"use client";

import { useState, useEffect, useRef } from "react";

const ARCHITECTURE_NODES = [
  {
    id: "data",
    label: "Market Data",
    desc: "Real-time & historical feeds",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
        />
      </svg>
    ),
    position: "left",
    row: 0,
  },
  {
    id: "pipeline",
    label: "Data Pipeline",
    desc: "Validation & normalization",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
        />
      </svg>
    ),
    position: "left",
    row: 1,
  },
  {
    id: "training",
    label: "Model Training",
    desc: "Walk-forward learning",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
    position: "center",
    row: 1,
  },
  {
    id: "models",
    label: "Model Store",
    desc: "Versioned artifacts",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
    position: "center",
    row: 2,
  },
  {
    id: "inference",
    label: "Inference Engine",
    desc: "Real-time predictions",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    position: "right",
    row: 1,
  },
  {
    id: "api",
    label: "API Layer",
    desc: "REST & webhooks",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    ),
    position: "right",
    row: 0,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    desc: "Forecasts & analytics",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
    position: "right",
    row: 2,
  },
];

const FLOW_CONNECTIONS = [
  { from: "data", to: "pipeline" },
  { from: "pipeline", to: "training" },
  { from: "training", to: "models" },
  { from: "models", to: "inference" },
  { from: "pipeline", to: "inference" },
  { from: "inference", to: "api" },
  { from: "inference", to: "dashboard" },
];

const ProductArchitecture = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [animatedConnections, setAnimatedConnections] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate connections sequentially
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setAnimatedConnections((prev) => {
        if (prev >= FLOW_CONNECTIONS.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isVisible]);

  const getConnectedNodes = (nodeId: string) => {
    const connected: string[] = [];
    FLOW_CONNECTIONS.forEach((conn) => {
      if (conn.from === nodeId) connected.push(conn.to);
      if (conn.to === nodeId) connected.push(conn.from);
    });
    return connected;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-50 py-20 dark:bg-neutral-950"
    >
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <div
            className={`flex items-center gap-2 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Product architecture
            </p>
          </div>

          <h2
            className={`mt-4 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            How{" "}
            <span
              className="inline-block"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand) 0%, rgba(4,236,58,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              everything connects
            </span>
            .
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            A high-level view of how data flows through the platform—from raw
            market feeds to actionable forecasts in your dashboard.
          </p>
        </div>

        {/* Architecture diagram */}
        <div
          className={`mt-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="relative rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-black sm:p-10">
            {/* Grid background */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-30 dark:opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            {/* Flow diagram */}
            <div className="relative">
              {/* SVG connections */}
              <svg
                className="absolute inset-0 h-full w-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "var(--brand)", stopOpacity: 0.3 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "var(--brand)", stopOpacity: 0.8 }}
                    />
                  </linearGradient>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="var(--brand)"
                      opacity="0.6"
                    />
                  </marker>
                </defs>
              </svg>

              {/* Nodes grid */}
              <div className="grid grid-cols-3 gap-6 sm:gap-8">
                {/* Left column */}
                <div className="flex flex-col gap-6 sm:gap-8">
                  {ARCHITECTURE_NODES.filter((n) => n.position === "left").map(
                    (node, i) => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        isVisible={isVisible}
                        delay={400 + i * 100}
                        isActive={activeNode === node.id}
                        isConnected={
                          activeNode
                            ? getConnectedNodes(activeNode).includes(node.id)
                            : false
                        }
                        onHover={setActiveNode}
                      />
                    )
                  )}
                </div>

                {/* Center column */}
                <div className="flex flex-col items-center justify-center gap-6 sm:gap-8">
                  {ARCHITECTURE_NODES.filter(
                    (n) => n.position === "center"
                  ).map((node, i) => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      isVisible={isVisible}
                      delay={500 + i * 100}
                      isActive={activeNode === node.id}
                      isConnected={
                        activeNode
                          ? getConnectedNodes(activeNode).includes(node.id)
                          : false
                      }
                      onHover={setActiveNode}
                    />
                  ))}
                </div>

                {/* Right column */}
                <div className="flex flex-col items-end gap-6 sm:gap-8">
                  {ARCHITECTURE_NODES.filter((n) => n.position === "right").map(
                    (node, i) => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        isVisible={isVisible}
                        delay={600 + i * 100}
                        isActive={activeNode === node.id}
                        isConnected={
                          activeNode
                            ? getConnectedNodes(activeNode).includes(node.id)
                            : false
                        }
                        onHover={setActiveNode}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Flow arrows (simplified visual) */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Horizontal flow indicators */}
                <div
                  className={`absolute left-[20%] top-[30%] w-[15%] h-0.5 transition-all duration-500 ${
                    animatedConnections >= 1 ? "opacity-60" : "opacity-0"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent"
                    style={{ borderLeftColor: "var(--brand)" }}
                  />
                </div>

                <div
                  className={`absolute left-[65%] top-[30%] w-[15%] h-0.5 transition-all duration-500 ${
                    animatedConnections >= 5 ? "opacity-60" : "opacity-0"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                />

                <div
                  className={`absolute left-[65%] top-[70%] w-[15%] h-0.5 transition-all duration-500 ${
                    animatedConnections >= 6 ? "opacity-60" : "opacity-0"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                />
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-neutral-100 pt-6 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <div
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: "var(--brand)", opacity: 0.2 }}
                />
                <span>Data flow</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="h-3 w-3 rounded border-2 border-neutral-300 dark:border-neutral-600" />
                <span>Component</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <div
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <span>Active / highlighted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p
          className={`mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          Hover over components to see connections. This is a conceptual
          overview—actual infrastructure details available upon request.
        </p>
      </div>
    </section>
  );
};

// Node card component
const NodeCard = ({
  node,
  isVisible,
  delay,
  isActive,
  isConnected,
  onHover,
}: {
  node: (typeof ARCHITECTURE_NODES)[0];
  isVisible: boolean;
  delay: number;
  isActive: boolean;
  isConnected: boolean;
  onHover: (id: string | null) => void;
}) => {
  return (
    <div
      className={`group relative w-full max-w-[180px] overflow-hidden rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${
        isActive
          ? "border-[var(--brand)] bg-[var(--brand)]/5 shadow-lg shadow-[var(--brand)]/10"
          : isConnected
          ? "border-[var(--brand)]/50 bg-[var(--brand)]/5"
          : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Icon */}
      <div
        className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200 ${
          isActive || isConnected
            ? "bg-[var(--brand)]/15 text-[var(--brand)]"
            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
        }`}
      >
        {node.icon}
      </div>

      <h3
        className={`text-sm font-semibold transition-colors duration-200 ${
          isActive || isConnected
            ? "text-[var(--brand)]"
            : "text-neutral-900 dark:text-white"
        }`}
      >
        {node.label}
      </h3>

      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
        {node.desc}
      </p>

      {/* Active indicator */}
      {isActive && (
        <span
          className="absolute top-2 right-2 h-2 w-2 rounded-full animate-pulse"
          style={{ backgroundColor: "var(--brand)" }}
        />
      )}
    </div>
  );
};

export default ProductArchitecture;
