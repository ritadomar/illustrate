function RemoveComponent({ className, onRemove }) {
  return <i className={className + ' pi pi-times-circle'} onClick={onRemove} />;
}

export default RemoveComponent;
