import React from "react";

// Generic Skeleton component
const Skeleton = ({
  className = "",
  width,
  height,
  variant = "text",
  count = 1,
  animation = "loading",
  ...props
}) => {
  const getSkeletonClass = () => {
    const baseClass = "skeleton";
    const variantClass =
      variant !== "text" ? `skeleton-${variant}` : "skeleton-text";
    const animationClass = animation === "pulse" ? "skeleton-pulse" : "";

    return `${baseClass} ${variantClass} ${animationClass} ${className}`.trim();
  };

  const style = {
    ...(width && { width }),
    ...(height && { height }),
    ...props.style,
  };

  if (count > 1) {
    return (
      <div className="skeleton-loading-container">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className={getSkeletonClass()}
            style={style}
            {...props}
          />
        ))}
      </div>
    );
  }

  return <div className={getSkeletonClass()} style={style} {...props} />;
};

// Skeleton variants for common use cases
export const SkeletonCard = ({ count = 1 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="skeleton-card">
        <div className="skeleton-card-header">
          <Skeleton variant="card-icon" />
          <div className="skeleton-card-info">
            <Skeleton variant="card-account" />
            <Skeleton variant="card-name" />
          </div>
        </div>
        <div className="skeleton-card-footer">
          <Skeleton variant="text" width="40%" />
          <div className="skeleton-card-actions">
            <Skeleton variant="card-action" />
            <Skeleton variant="card-action" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonProfile = () => (
  <div className="skeleton-sidebar-profile">
    <Skeleton variant="sidebar-avatar" />
    <div className="skeleton-sidebar-info">
      <Skeleton variant="sidebar-name" />
      <Skeleton variant="sidebar-email" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-loading-container">
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table-row">
        {Array.from({ length: columns }, (_, colIndex) => (
          <Skeleton key={colIndex} variant="table-cell" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonForm = ({ fields = 3 }) => (
  <div className="skeleton-loading-container">
    {Array.from({ length: fields }, (_, index) => (
      <div key={index} className="skeleton-form-field">
        <Skeleton variant="form-label" />
        <Skeleton variant="form-input" />
      </div>
    ))}
  </div>
);

export const SkeletonNavigation = ({ items = 5 }) => (
  <div className="skeleton-loading-container">
    {Array.from({ length: items }, (_, index) => (
      <Skeleton key={index} variant="nav-item" />
    ))}
  </div>
);

export const SkeletonDashboard = () => (
  <div className="skeleton-loading-container">
    {/* Header */}
    <Skeleton variant="title" />
    <Skeleton variant="subtitle" />

    {/* Stats Cards */}
    <div style={{ display: "flex", gap: "16px", margin: "24px 0" }}>
      <Skeleton width="200px" height="80px" />
      <Skeleton width="200px" height="80px" />
      <Skeleton width="200px" height="80px" />
    </div>

    {/* Main Content */}
    <SkeletonCard count={6} />
  </div>
);

export const SkeletonPage = ({ type = "default" }) => {
  switch (type) {
    case "dashboard":
      return <SkeletonDashboard />;
    case "profile":
      return (
        <div className="skeleton-loading-container">
          <Skeleton variant="title" />
          <div style={{ display: "flex", gap: "24px", margin: "24px 0" }}>
            <Skeleton variant="avatar" />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" count={3} />
            </div>
          </div>
          <SkeletonForm fields={5} />
        </div>
      );
    case "table":
      return (
        <div className="skeleton-loading-container">
          <Skeleton variant="title" />
          <SkeletonTable rows={8} columns={5} />
        </div>
      );
    case "form":
      return (
        <div className="skeleton-loading-container">
          <Skeleton variant="title" />
          <Skeleton variant="text" />
          <SkeletonForm fields={4} />
          <Skeleton variant="button" width="120px" />
        </div>
      );
    default:
      return (
        <div className="skeleton-loading-container">
          <Skeleton variant="title" />
          <Skeleton variant="text" count={4} />
        </div>
      );
  }
};

export default Skeleton;
