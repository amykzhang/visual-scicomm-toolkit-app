import styled from "styled-components";

const LargeText = styled.p`
    color: #000;
    font-size: 20px;
    font-family: Quicksand;
    font-weight: 700;
`;

const MediumText = styled.p`
    color: #000;
    font-size: 17px;
    font-family: Roboto;

    b {
        font-family: Roboto-Bold;
    }
`;

const BoldMediumText = styled.p`
    color: #000;
    font-size: 16px;
    font-family: Roboto-Bold;
    font-weight: 900;
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
    BoldMediumText: BoldMediumText,
    SmallMediumText: SmallMediumText,
    SmallText: SmallText,
};

export default typography;
