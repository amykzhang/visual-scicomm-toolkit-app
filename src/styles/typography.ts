import styled from "styled-components";

const LargeText = styled.p`
    color: #000;
    font-size: 20px;
    font-family: Quicksand;
    font-weight: 700;
    margin: 0px;
    padding: 0px;
`;

const MediumText = styled.p`
    color: #000;
    font-size: 17px;
    font-family: Roboto;
    margin: 0px;
    padding: 0px;

    b {
        font-family: Roboto-Medium;
    }
`;

const BoldMediumText = styled.p`
    color: #000;
    font-size: 16px;
    font-family: Roboto-Medium;
    margin: 0px;
    padding: 0px;
`;

const SmallText = styled.p`
    color: #000;
    font-size: 14px;
    font-family: Roboto;
    margin: 0px;
    padding: 0px;
`;

const BoldSmallText = styled.p`
    font-size: 14px;
    font-weight: 700;
    font-family: Roboto-Bold;
    margin: 0px;
    padding: 0px;
`;

const typography = {
    LargeText: LargeText,
    MediumText: MediumText,
    BoldMediumText: BoldMediumText,
    BoldSmallText: BoldSmallText,
    SmallText: SmallText,
};

export default typography;
