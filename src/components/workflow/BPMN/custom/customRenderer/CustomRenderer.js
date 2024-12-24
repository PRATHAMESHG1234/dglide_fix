import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import operationIcon from '../../../../../assets/wheel.png';
import table from '../../../../../assets/table.svg';
import mail from '../../../../../assets/email.png';
import user from '../../../../../assets/user.png';
import apiIcon from '../../../../../assets/restapi.png';
import pen from '../../../../../assets/pen.png';
import InsertIcon from '../../../../../assets/insert.png';
import DateAdd from '../../../../../assets/dateAdd.png';
import DateDiff from '../../../../../assets/dateDiff.png';
import DateFetch from '../../../../../assets/calendar_9741165.png';
import LengthIcon from '../../../../../assets/length.png';
import MatchesIcon from '../../../../../assets/matches.png';
import ReplaceIcon from '../../../../../assets/replace.png';
import ReplaceAllIcon from '../../../../../assets/replaceall.png';
import IsSubStringIcon from '../../../../../assets/issubstring.png';
import UpperCaseIcon from '../../../../../assets/uppercase.png';
import LowerCaseIcon from '../../../../../assets/lowercase.png';
import TrimIcon from '../../../../../assets/trim.png';
import SubstringIcon from '../../../../../assets/substring.png';
import ConcatIcon from '../../../../../assets/substring.png';
import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate,
  remove as svgRemove
} from 'tiny-svg';

import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil';

import { is } from 'bpmn-js/lib/util/ModelUtil';
import { colors } from '../../../../../common/constants/styles';

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
    console.log(element);
    const ElementCharcterId = element.businessObject.id.split('-')[0];

    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    if (is(element, 'bpmn:StartEvent')) {
      svgAttr(shape, {
        fill: colors.success.light,
        stroke: colors.success.main,
        'stroke-width': 4
      });
      const customText = svgCreate('text');
      const customTextContent = 'Start';

      svgAttr(customText, {
        x: element.width / 2,
        y: element.height + 18,
        'text-anchor': 'middle',
        'font-size': '12px',
        fill: '#000'
      });

      svgAppend(customText, document.createTextNode(customTextContent));
      svgAppend(parentNode, customText);
      element.businessObject.name = 'Start';
      return shape;
    } else if (is(element, 'bpmn:EndEvent')) {
      svgAttr(shape, {
        fill: colors.error.light,
        stroke: colors.error.main,
        'stroke-width': 4
      });
      const customText = svgCreate('text');
      const customTextContent = 'End'; // Replace with your desired name

      svgAttr(customText, {
        x: element.width / 2,
        y: element.height + 18,
        'text-anchor': 'middle',
        'font-size': '12px',
        fill: '#000'
      });

      svgAppend(customText, document.createTextNode(customTextContent));
      svgAppend(parentNode, customText);
      element.businessObject.name = 'End';
      return shape;
    }

    if (
      is(element, 'bpmn:Task') &&
      (element.businessObject.type === 'operation' ||
        ElementCharcterId === 'OPE')
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        80,
        TASK_BORDER_RADIUS,
        colors.warning.light
      );
      svgAttr(rectr, {
        stroke: colors.warning.main,
        'stroke-width': 2,
        outline: 'none'
        // 'stroke-dasharray': '5'
      });
      prependTo(rectr, parentNode);

      var size = 18;
      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: operationIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);
      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px',
        fill: 'black'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'operation';
      return shape;
    } else if (
      is(element, 'bpmn:Task') &&
      (element.businessObject.type === 'notify' || ElementCharcterId === 'NOT')
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        80,
        TASK_BORDER_RADIUS,
        colors.secondary[200]
      );
      svgAttr(rectr, {
        stroke: colors.secondary.main,
        'stroke-width': 2
        // 'stroke-dasharray': '5'
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: mail,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px',
        fill: 'black'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'notify';
      return shape;
    } else if (
      is(element, 'bpmn:Task') &&
      (element.businessObject.name === 'Set value' ||
        ElementCharcterId === 'SET')
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        80,
        TASK_BORDER_RADIUS,
        colors.primary[200]
      );
      svgAttr(rectr, {
        stroke: colors.primary.main,
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: pen,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px',
        fill: 'black'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'set-value';
      return shape;
    } else if (
      is(element, 'bpmn:Task') &&
      (element.businessObject.type === 'approval' ||
        ElementCharcterId === 'APP')
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        80,
        TASK_BORDER_RADIUS,
        colors.orange.main
      );
      svgAttr(rectr, {
        stroke: colors.orange.dark,
        'stroke-width': 2
        // 'stroke-dasharray': '5'
      });

      prependTo(rectr, parentNode);
      var size = 18;
      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: user,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px',
        fill: 'black'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'approval';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') && element.businessObject.type === 'restApi') ||
      ElementCharcterId === 'RES'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        80,
        TASK_BORDER_RADIUS,
        colors.success.light
      );
      svgAttr(rectr, {
        stroke: colors.success.main,
        'stroke-width': 2
        // 'stroke-dasharray': '5'
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: apiIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px',
        fill: 'black'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'restApi';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') && element.businessObject.type === 'task') ||
      ElementCharcterId === 'TAS'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        80,
        TASK_BORDER_RADIUS,
        colors.success.light
      );
      svgAttr(rectr, {
        stroke: colors.success.main,
        'stroke-width': 2
        // 'stroke-dasharray': '5'
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: apiIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px',
        fill: 'black'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'template';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'InsertOperation') ||
      ElementCharcterId === 'INS'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: InsertIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'lengthOperation') ||
      ElementCharcterId === 'LEN'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: LengthIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'matchesOperation') ||
      ElementCharcterId === 'MAT'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: MatchesIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'replaceOperation') ||
      ElementCharcterId === 'REP'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: ReplaceIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'reapaceallOperation') ||
      ElementCharcterId === 'REA'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: ReplaceAllIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'issubstringOperation') ||
      ElementCharcterId === 'ISS'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: IsSubStringIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'uppercaseOperation') ||
      ElementCharcterId === 'UPP'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: UpperCaseIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'lowercaseOperation') ||
      ElementCharcterId === 'LOW'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: LowerCaseIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'trimOperation') ||
      ElementCharcterId === 'TRI'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      svgAttr(img, {
        href: TrimIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'substringOperation') ||
      ElementCharcterId === 'SUB'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      svgAttr(img, {
        href: SubstringIcon, // Assuming SubstringIcon is defined elsewhere
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'concatOperation') ||
      ElementCharcterId === 'CON'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      svgAttr(img, {
        href: ConcatIcon, // Assuming ConcatIcon is defined elsewhere
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'stringOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:ExclusiveGateway') &&
        element.businessObject.type === 'exclusiveGateway') ||
      ElementCharcterId === 'EXC'
    ) {
      const gatewayShape = shape;

      svgAttr(gatewayShape, {
        fill: colors.grey[700],
        strokeWidth: 2
      });

      var size = 18;

      var padding = is(element, 'bpmn:ExclusiveGateway')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        // href: icon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      // Create the text element
      const customText = svgCreate('text');
      const customTextContentLine1 = 'Exclusive'; // First line of text
      const customTextContentLine2 = 'Gateway'; // Second line of text

      svgAttr(customText, {
        x: element.width / 1.75,
        y: element.height + 2,
        'text-anchor': 'middle',
        'font-size': '12px',
        fill: '#000'
      });

      // Create first line of text using tspan
      const tspan1 = svgCreate('tspan');
      svgAttr(tspan1, {
        x: element.width / 1.75,
        dy: '1.2em'
      });
      tspan1.textContent = customTextContentLine1;
      svgAppend(customText, tspan1);

      // Create second line of text using tspan
      const tspan2 = svgCreate('tspan');
      svgAttr(tspan2, {
        x: element.width / 1.75,
        dy: '1.2em'
      });
      tspan2.textContent = customTextContentLine2;
      svgAppend(customText, tspan2);

      svgAppend(parentNode, customText);
      element.businessObject.$attrs.s_type = 'exclusiveGateway';
      return gatewayShape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'InsertOperation') ||
      ElementCharcterId === 'INS'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: InsertIcon,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'notify';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'dateAddOperation') ||
      ElementCharcterId === 'DAD'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: DateAdd,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'dateTimeOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'dateDiffOperation') ||
      ElementCharcterId === 'DDI'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: DateDiff,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'dateTimeOperation';
      return shape;
    } else if (
      (is(element, 'bpmn:Task') &&
        element.businessObject.type === 'dateFetchOperation') ||
      ElementCharcterId === 'DFE'
    ) {
      const id = element.businessObject.id;
      const rectr = drawRect(
        parentNode,
        100,
        70,
        TASK_BORDER_RADIUS,
        colors.primary.light
      );
      svgAttr(rectr, {
        stroke: colors.secondary[800],
        'stroke-width': 2
      });
      prependTo(rectr, parentNode);

      var size = 18;

      var padding = is(element, 'bpmn:Task')
        ? { x: 5, y: 5 }
        : { x: (element.width - size) / 2, y: (element.height - size) / 2 };

      var img = svgCreate('image');
      // var icon = 'https://www.svgrepo.com/show/19461/url-link.svg';
      svgAttr(img, {
        href: DateFetch,
        width: size,
        height: size,
        ...padding
      });

      svgAppend(parentNode, img);

      svgRemove(shape);

      var textElement = svgCreate('text');
      svgAttr(textElement, {
        x: element.width / 2,
        y: element.height / 2 + 21,
        'text-anchor': 'middle',
        'font-size': '12px'
      });
      textElement.textContent = `(${id})`;
      svgAppend(parentNode, textElement);
      element.businessObject.$attrs.s_type = 'dateTimeOperation';
      return shape;
    } else if (
      is(element, 'bpmn:ParallelGateway') &&
      (element.businessObject.type === 'parallelGateway' ||
        ElementCharcterId === 'PAR')
    ) {
      const id = element.businessObject.id;

      element.businessObject.$attrs.s_type = 'parallelGateway';
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
