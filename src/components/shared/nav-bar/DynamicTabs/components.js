/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { css } from '@emotion/css';
import classNames from 'classnames';
import { COLORS } from '../../../../common/constants/styles';

export function Container({ children, innerProps }) {
  return <div {...innerProps}>{children}</div>;
}

export function TabContainer({ innerRef, children, innerProps }) {
  return (
    <div
      className={css`
        display: flex;
        align: stretch;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        flex: 1;
        min-width: 1px;
        & > * {
          flex-shrink: 0;
        }
      `}
      ref={innerRef}
      {...innerProps}
    >
      {children}
    </div>
  );
}

export function MenuContainer({ innerRef, children, innerProps }) {
  return (
    <div
      className={css`
        display: flex;
        align: stretch;
        position: relative;
      `}
      ref={innerRef}
      {...innerProps}
    >
      {children}
    </div>
  );
}

export function MenuButton({ menuIsOpen, innerProps, innerRef }) {
  return (
    <button
      className={classNames({
        [css`border: none; color: ${COLORS.SECONDARY} background: none; font-weight: bold; -webkit-appearance: none; -moz-appearance: none; padding: 0.5em; &:hover { color: ${COLORS.PRIMARY} }`]: true,
        [css`
          &:hover {
            color: ${COLORS.PRIMARY};
          }
        `]: menuIsOpen
      })}
      ref={innerRef}
      title="More"
      aria-label="More"
      {...innerProps}
    >
      ...
    </button>
  );
}

export function Menu({ children, innerProps }) {
  return (
    <div
      className={css`
        position: absolute;
        top: 100%;
        right: 0;
        padding: 15px;
        background: ${COLORS.WHITE};
        min-width: 180px;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.32);
      `}
      {...innerProps}
    >
      {children}
    </div>
  );
}

export default {
  Container,
  TabContainer,
  MenuContainer,
  MenuButton,
  Menu
};
