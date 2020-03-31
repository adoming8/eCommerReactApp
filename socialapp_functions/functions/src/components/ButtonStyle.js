import styled from 'styled-components'

export const ButtonStyle = styled.button`
text-transform: capitalize;
font-size: 2.1rem;
background: transparent,
border: 0.05rem solid var(--lightBlue);
color: var(--lightBlue);
border-radius: 0.5rem;
padding: 0.2rem 0.5rem;
cursor: pointer;
margin: 0.4rem 0.5rem 0;
transition: 0.5s ease-in-out;
&:hover{
  background: var(--lightBlue);
  color: var(--mainBlue);
}
&:focus{
  outline: none;
}
`