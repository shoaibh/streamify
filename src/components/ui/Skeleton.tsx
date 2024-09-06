const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`skeleton-container ${className || ""}`}>
      <div className="skeleton-animation" />
    </div>
  );
};

const styles = `
    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  
    .skeleton-container {
      position: relative;
      overflow: hidden;
      background-color: #e2e8f0;
      border-radius: 0.25rem;
    }
  
    .skeleton-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      animation: shimmer 1.5s infinite;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  `;

const SkeletonWithStyles = ({ className }: { className?: string }) => (
  <>
    <style>{styles}</style>
    <Skeleton className={className} />
  </>
);

export default SkeletonWithStyles;
