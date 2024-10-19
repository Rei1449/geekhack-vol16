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
            <MessageFormWrapper>
                <MessageInput />
                <MessageSendButton/>
            </MessageFormWrapper>
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

const MessageFormWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 16px;
    gap: 16px;
    
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
`;

const MessageInput = styled.div`
    height: 50px; 
    width: 300px;
    
    background-color: white;
    border-radius: 50px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 10px 10px 0 rgb(156 160 160 / 40%);
`;

const MessageSendButton = styled.button`
    height: 50px;
    width: 50px;
    transition: all 0.3s;
    
    background-color: white;
    box-shadow: 10px 10px 0 rgb(156 160 160 / 40%);
    border-radius: 50%;
    border: none;
    color: white;
    font-size: 24px;
    font-weight: 500;
    cursor: pointer;
    
    &:active {
        transform: scale(0.5);
    }
`;