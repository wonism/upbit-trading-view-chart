import styled from 'styled-components';

export default styled.button`
  margin: 0 6px;
  padding: 0;
  line-height: 20px;
  background-color: transparent;
  background-image: none;
  border: 0;
  outline: 0;
  font-family: sans-serif;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
  ${({ darkMode }) => (darkMode ? `
    color: #E77D3A;
  ` : `
    color: #1882C5;
  `)}
`;
