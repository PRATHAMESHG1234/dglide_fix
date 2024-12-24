import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate,
  remove as svgRemove
} from 'tiny-svg';

import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil';

import { is } from 'bpmn-js/lib/util/ModelUtil';
import { colors } from '../../../../../../../common/constants/styles';
import { Plus } from 'lucide-react';

// import { isNil } from 'min-dash';

const HIGH_PRIORITY = 1500,
  TASK_BORDER_RADIUS = 5;

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {
    return !element.labelTarget;
  }
  drawShape(parentNode, element) {
    // const elemnetId = element.businessObject.id.split('_')[0];
    // console.log(elemnetId);
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    if (
      is(element, 'bpmn:Task') &&
      (element.businessObject.name === 'Source' ||
        element.businessObject.id === 'NOT-619')
    ) {
      const rectr = drawRect(
        parentNode,
        100,
        80,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.grey[900],
        'stroke-width': 2,
        outline: 'none'
        // 'stroke-dasharray': '5'
      });
      prependTo(rectr, parentNode);

      var size = 35;
      var padding = {
        x: (element.width - size) / 2, // Center horizontally
        y: (element.height - size) / 2 // Center vertically
      };
      var img = svgCreate('image');
      let {
        $attrs: { variables, type, elementData }
      } = element.businessObject;
      if (variables) {
        const parcedVariable = JSON.parse(variables);
        var icon = parcedVariable?.logo;
        svgAttr(img, {
          href: icon,
          width: size,
          height: size,
          x: padding.x,
          y: padding.y
        });
      }

      svgAppend(parentNode, img);
      svgRemove(shape);
      return shape;
    } else if (
      is(element, 'bpmn:Task') &&
      (element.businessObject.name === 'Destination' ||
        element.businessObject.id === 'DES-888')
    ) {
      const rectr = drawRect(
        parentNode,
        100,
        80,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary.main,
        'stroke-width': 2
        // 'stroke-dasharray': '5'
      });
      prependTo(rectr, parentNode);

      var size = 35;

      var padding = {
        x: (element.width - size) / 2, // Center horizontally
        y: (element.height - size) / 2 // Center vertically
      };

      var img = svgCreate('image');
      let {
        $attrs: { variables }
      } = element.businessObject;
      if (variables) {
        const parcedVariable = JSON.parse(variables);

        var icon = parcedVariable?.logo;
        svgAttr(img, {
          href: icon,
          width: size,
          height: size,
          x: padding.x,
          y: padding.y
        });
      }

      svgAppend(parentNode, img);

      svgRemove(shape);

      return shape;
    } else if (
      is(element, 'bpmn:Task') &&
      (element.businessObject.name === 'Transformation' ||
        element.businessObject.id === 'DYN-101')
    ) {
      var size = 18;

      const rectr = drawRect(
        parentNode,
        110,
        30,
        TASK_BORDER_RADIUS,
        colors.primary.dark
      );
      let height = (element.height + 10) / 2;
      svgAttr(rectr, {
        y: 15,
        height,
        stroke: colors.primary.main,
        'stroke-width': 2
        // 'stroke-dasharray': '5'
      });
      prependTo(rectr, parentNode);

      var padding = {
        x: (element.width - size) / 2, // Center horizontally
        y: (element.height - size) / 2 - 25 // Center vertically
      };

      var img = svgCreate('text');

      svgAttr(img, {
        x: padding.x - 38,
        y: padding.y + 40,
        // 'dominant-baseline': 'middle',
        'font-size': 20,
        fill: 'white'
      });
      img.textContent = '+';
      svgAppend(parentNode, img);

      svgRemove(shape);

      return shape;
    }

    return shape;
  }

  getShapePath(shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }
    return this.bpmnRenderer.getShapePath(shape);
  }
}
CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

function drawRect(
  parentNode,
  width,
  height,
  borderRadius,
  color,
  shape = 'rect'
) {
  const rect = svgCreate(shape);

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
  });

  svgAppend(parentNode, rect);

  return rect;
}
function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}
