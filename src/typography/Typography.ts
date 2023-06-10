import styled from 'styled-components';

const StyledH1 = styled.p`
    font-size: 1rem;
    font-weight: 900;
    margin: 0;
    padding: 0;
`

const StyledH2 = styled.p`
    font-size: 0.8rem;
    font-weight: 700;
    margin: 0;
    padding: 0;
`

const typography = {
    LargeText: StyledH1,
    MediumText: StyledH2,
}

export default typography;