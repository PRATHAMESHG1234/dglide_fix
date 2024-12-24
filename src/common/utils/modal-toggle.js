export const MODAL = {
  create: "create",
  edit: "edit",
  delete: "delete",
  cancel: "cancel",
  details: "details",
  moveTo: "moveTo",
  rename: "rename",
  importSchema: "importSchema",
  exportSchema: "exportSchema",
};

export const initialState = {
  selected: null,
  type: "",
  show: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case MODAL.create:
      return { selected: null, show: true, type: MODAL.create };

    case MODAL.edit:
      return { selected: action.data, show: true, type: MODAL.edit };

    case MODAL.delete:
      return { selected: action.data, show: true, type: MODAL.delete };

    case MODAL.cancel:
      return { selected: null, show: false, type: "" };

    case MODAL.details:
      return { selected: action.data, show: true, type: MODAL.details };

    case MODAL.moveTo:
      return { selected: action.data, show: true, type: MODAL.moveTo };

    case MODAL.rename:
      return { selected: action.data, show: true, type: MODAL.rename };
    case MODAL.importSchema:
      return {
        selected: action.data,
        show: true,
        type: MODAL.importSchema,
      };
    case MODAL.exportSchema:
      return {
        selected: action.data,
        show: true,
        type: MODAL.exportSchema,
      };

    default:
      return state;
  }
};
