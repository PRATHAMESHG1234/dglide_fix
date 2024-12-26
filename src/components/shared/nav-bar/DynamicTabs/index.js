import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

import defaultComponents from './components';
import useOnClickOutside from './useOnClickOutside';
import { color } from 'framer-motion';
import { COLORS, colors } from '../../../../common/constants/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
export default function DynamicTabs({ children, components = {}, ...props }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [visibleTabIndices, setVisibleTabIndices] = useState([]);
  const [measuringRender, setMeasuringRender] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { currentUser, currentTheme } = useSelector((state) => state.auth);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const overflowRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    setMeasuringRender(true);
  }, []);

  useLayoutEffect(() => {
    if (measuringRender) {
      const tabElements = Array.from(containerRef.current.children);

      let stopWidth = 0;
      const visible = [];
      tabElements?.forEach((tab, index) => {
        if (visible.length === tabElements.length - 1) {
          stopWidth -= buttonRef.current.offsetWidth;
        }

        stopWidth += tab.offsetWidth + 40;
        if (containerRef.current.offsetWidth >= stopWidth) {
          visible.push(index);
        }
      });
      setVisibleTabIndices(visible);
      setMeasuringRender(false);
    }
  }, [measuringRender]);

  useOnClickOutside(overflowRef, () => {
    setMenuIsOpen(false);
  });

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return function cleanUp() {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      setMeasuringRender(true);
      setMenuIsOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return function cleanUp() {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setMeasuringRender(true);
  }, [children]);

  const allTabs = React.Children?.map(children, (tab, index) => {
    return React.cloneElement(tab, {
      key: index
    });
  });

  let visibleTabs = [];
  const overflowTabs = [];
  if (!isMounted || measuringRender) {
    visibleTabs = allTabs;
  } else {
    allTabs?.forEach((tab, index) => {
      if (visibleTabIndices.includes(index)) {
        visibleTabs.push(tab);
      } else {
        overflowTabs.push(tab);
      }
    });
  }

  const { Container, TabContainer, MenuContainer, MenuButton, Menu } = {
    ...defaultComponents,
    ...components
  };

  return (
    <Container
      innerProps={{
        ...props,
        style: {
          ...props.style,
          display: 'flex',
          marginLeft: '70px'
        }
      }}
    >
      <TabContainer innerRef={containerRef}>{visibleTabs}</TabContainer>

      {(measuringRender || overflowTabs.length > 0) && (
        <MenuContainer innerRef={overflowRef}>
          <Avatar
            variant="rounded"
            sx={{
              cursor: 'pointer',
              borderRadius: '8px',
              width: '34px',
              height: '34px',
              fontSize: '1.2rem',
              transition: 'all .2s ease-in-out',
              background:
                currentTheme === 'Dark'
                  ? colors.darkBackground
                  : colors.secondary.light,
              color: colors.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: colors.secondary.dark,
                color: colors.secondary.light
              }
            }}
            ref={buttonRef}
            aria-haspopup="true"
            onClick={() => setMenuIsOpen(!menuIsOpen)}
            color="inherit"
          >
            {' '}
            <MoreHorizIcon stroke={1.5} size="20px" />
          </Avatar>

          {menuIsOpen && (
            <Menu
              innerProps={{
                ...props,
                style: {
                  ...props.style,
                  background:
                    currentTheme === 'Dark' ? colors.darkLevel2 : colors.white
                }
              }}
            >
              {overflowTabs}
            </Menu>
          )}
        </MenuContainer>
      )}
    </Container>
  );
}
