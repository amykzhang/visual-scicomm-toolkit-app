import styled from 'styled-components'

export const UILayer = styled.div`
	position: absolute;
	inset: 0px;
	z-index: 300;
	pointer-events: none;
`

export const SquareButton = styled.button`
    pointer-events: all;
    background: white;
    border: none;
    border-radius: 0px;
    width: 2rem;
    height: 2rem;

    &:hover {
        background-color: lightblue;
    }

    &[data-isactive='true'] {
    background-color: lightblue;
    }
`

export const TopContainer = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    background-color: red;
`
