export const withCheckStatus = Component => {
  return function HOCWithCheckStatus({ uuid, children, ...props }) {
    return (
      <Component uuid={uuid} {...props}>
        {children}
      </Component>
    );
  };
};
