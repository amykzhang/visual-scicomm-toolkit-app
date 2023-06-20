import styled from "styled-components";

const LargeText = styled.p`
    font-size: 20px;
    font-weight: 900;
    margin: 0;
    padding: 0;
`;

const MediumText = styled.p`
    font-size: 16.66px;
    font-weight: 700;
    margin: 0;
    padding: 0;
`;

const SmallMediumText = styled.p`
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    padding: 0;
`;

const SmallText = styled.p`
    font-size: 14px;
    font-weight: 700;
    margin: 0;
    padding: 0;
`;

const typography = {
    LargeText: LargeText,
    MediumText: MediumText,
    SmallMediumText: SmallMediumText,
    SmallText: SmallText,
};

export default typography;
