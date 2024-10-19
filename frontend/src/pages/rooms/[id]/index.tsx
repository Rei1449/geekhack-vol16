import { useRouter } from "next/router";
import styled from "styled-components";

export default function RoomPage() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Wrapper>
            <Message>
                Room ID: {id}
            </Message>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #F1F1F1;
`;

const Message = styled.div`
    font-size: 24px;
    font-weight: 500;
    `;