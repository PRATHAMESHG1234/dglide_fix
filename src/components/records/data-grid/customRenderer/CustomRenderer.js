import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate,
  remove as svgRemove,
} from "tiny-svg";

import { getRoundRectPath } from "bpmn-js/lib/draw/BpmnRenderUtil";

import { is } from "bpmn-js/lib/util/ModelUtil";
import { colors } from "../../../../common/constants/styles";

// import { isNil } from 'min-dash';

const HIGH_PRIORITY = 1500,
  TASK_BORDER_RADIUS = 5;

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer, tableRecord) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
    this.loadFromLocalStorage();
  }
  loadFromLocalStorage() {
    const storedData = localStorage.getItem("executionData");
    if (storedData) {
      this.storedData = JSON.parse(storedData);
    } else {
      this.storedData = {}; // Default value if nothing is stored
    }
  }

  getSuccessMethod(parentNode, shape) {
    const rectr = drawRect(
      parentNode,
      100,
      80,
      TASK_BORDER_RADIUS,
      colors.success.light
    );
    svgAttr(rectr, {
      stroke: colors.success.main,
      "stroke-width": 2,
      outline: "none",
      // 'stroke-dasharray': '5'
    });
    prependTo(rectr, parentNode);

    svgRemove(shape);
    return shape;
  }
  getWarningMethod(parentNode, shape) {
    const rectr = drawRect(
      parentNode,
      100,
      80,
      TASK_BORDER_RADIUS,
      colors.warning.light
    );
    svgAttr(rectr, {
      stroke: colors.warning.main,
      "stroke-width": 2,
      outline: "none",
    });
    prependTo(rectr, parentNode);

    svgRemove(shape);
    return shape;
  }
  getErrorMethod(parentNode, shape) {
    const rectr = drawRect(
      parentNode,
      100,
      80,
      TASK_BORDER_RADIUS,
      colors.error.light
    );
    svgAttr(rectr, {
      stroke: colors.error.main,
      "stroke-width": 2,
      outline: "none",
      // 'stroke-dasharray': '5'
    });
    prependTo(rectr, parentNode);

    svgRemove(shape);
    return shape;
  }
  canRender(element) {
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    if (
      is(element, "bpmn:Task")
      && element.businessObject.name !== "Approval" && element.businessObject.name !== "Notify"
    ) {
      Object.entries(this.storedData).map(([key, value]) => {
        if (value.result === "success" && element.businessObject.id === key) {
          this.getSuccessMethod(parentNode, shape)
        } else if (value.result === "pending" && element.businessObject.id === key) {
          this.getWarningMethod(parentNode, shape)
        } else if (value.result === "rejected" && element.businessObject.id === key) {
          this.getErrorMethod(parentNode, shape)
        }
      });
      return shape;
    } else if (element.businessObject.name === "Approval" && element.businessObject.id.split('-')[0] === 'APP') {
      Object.entries(this.storedData).map(([key, value]) => {

        if (value.type === 'all must sign approval' || value.type === 'mangerial') {
          const allSuccess = value.approvals.every(item => item.status === 'success');
          const allPending = value.approvals.every(item => item.status === 'pending' || item.status === 'success');
          const anyPendingOrFailed = value.approvals.some(item => item.status === 'pending' || item.status === 'failed');

          if (allSuccess) {
            this.getSuccessMethod(parentNode, shape)
          } else if (allPending) {
            this.getWarningMethod(parentNode, shape)
          } else if (anyPendingOrFailed) {
            this.getErrorMethod(parentNode, shape)
          }
        } else if (value.type === 'ad-hoc approval') {
          value.approvals.forEach((o) => {
            if (o.status === "approved") {
              this.getSuccessMethod(parentNode, shape)
            } else if (o.status === "pending") {
              this.getWarningMethod(parentNode, shape)
            } else if (o.status === "rejected") {
              this.getErrorMethod(parentNode, shape)
            }
          })

        } else if (value.type === 'one must sign approval') {
          const allRejected = value.approvals.every(item => item.status === "rejected");
          const allSuccess = value.approvals.some(item => item.status === 'approved' || item.status === 'rejected');
          const allPending = value.approvals.some(item => item.status === "pending" || item.status === 'rejected');
          if (allSuccess) {
            this.getSuccessMethod(parentNode, shape)
          } else if (allPending) {
            this.getWarningMethod(parentNode, shape)
          } else if (allRejected) {
            this.getErrorMethod(parentNode, shape)
          }
        }
      })
      return shape;
    } else if (element.businessObject.name === "Notify" && element.businessObject.id.split('-')[0] === 'NOT') {
      this.getSuccessMethod(parentNode, shape)
      return shape;
    }
  }

  getShapePath(shape) {
    if (is(shape, "bpmn:Task")) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }
    return this.bpmnRenderer.getShapePath(shape);
  }
}
CustomRenderer.$inject = ["eventBus", "bpmnRenderer"];

function drawRect(
  parentNode,
  width,
  height,
  borderRadius,
  color,
  shape = "rect"
) {
  const rect = svgCreate(shape);

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color,
  });

  svgAppend(parentNode, rect);

  return rect;
}
function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}
