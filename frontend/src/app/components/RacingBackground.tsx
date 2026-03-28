export function RacingBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Racing stripes background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500"></div>
      </div>
      
      {/* Checkered flag pattern */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {Array.from({ length: 10 }).map((_, i) =>
            Array.from({ length: 10 }).map((_, j) => (
              <rect
                key={`${i}-${j}`}
                x={i * 10}
                y={j * 10}
                width="10"
                height="10"
                fill={(i + j) % 2 === 0 ? "black" : "white"}
              />
            ))
          )}
        </svg>
      </div>

      {/* Speed lines */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"
            style={{
              top: `${10 + i * 12}%`,
              left: '-50%',
              right: '-50%',
              animation: `slide ${2 + i * 0.3}s linear infinite`,
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes slide {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(50%);
          }
        }
      `}</style>
    </div>
  );
}
