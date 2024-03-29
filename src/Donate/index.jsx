import { createElement, Fragment } from 'react';
import { bool, func } from 'prop-types';
import styled from 'styled-components';
import Button from '~/Button';

const Address = styled.div`
  font-family: 'Source Code Pro', monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Donate = ({ closed, darkMode, handleClick }) => (
  <>
    <Button type="button" onClick={handleClick} darkMode={darkMode}>
      {closed ? '기부 펼치기' : '기부 접기'}
    </Button>
    {closed ? null : (
      <>
        <br />
        <Address>
          BTC : 32DJGxZrqiFndoGF371jMz6nwiV7LXBKFF
        </Address>
        <Address>
          ETH : 0x3e795812fa458700b398f0242a1a4a99944cb048
        </Address>
        <Address>
          LTC : 3JxqJZ3GhpM6ACuu4u9LtXVwNNvdazPpzo
        </Address>
        <Address>
          DASH : XeN3R7KChRhpz5LxKq9RxG4R9Y9jq77b3D
        </Address>
      </>
    )}
  </>
);

Donate.propTypes = {
  closed: bool.isRequired,
  darkMode: bool.isRequired,
  handleClick: func.isRequired,
};

export default Donate;
