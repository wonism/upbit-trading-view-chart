import { createElement, Fragment } from 'react';
import { bool, func } from 'prop-types';
import styled from 'styled-components';

const Address = styled.div`
  font-family: 'Source Code Pro', monospace;
`;

const Button = styled.button`
  padding: 0;
  line-height: 20px;
  color: #1882C5;
  background-image: none;
  background-color: transparent;
  border: 0;
  outline: 0;
  font-family: sans-serif;
  font-size: 16px;
  text-decoration: underline;
`;

const Donate = ({ closed, handleClick }) => (
  <>
    <Button type="button" onClick={handleClick}>
      {closed ? '펼치기' : '접기'}
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
  handleClick: func.isRequired,
};

export default Donate;
