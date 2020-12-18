import styled from 'styled-components/native';

export const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: #121212;
`;

export const Title = styled.Text`
	color: ${props => props.cor}
	font-size: ${props => props.tam}px;
`;

export const Nome = styled.Text`
	color: #fff;
	font-size: 20px;
`;

export const Botao = styled.TouchableOpacity`
	background-color: #DDD;
	padding: 5px;
	border-radius: 5px;
	width: 90%;
	justify-content: center;
	align-items: center;
`;

export const BotaoText = styled.Text`
	color: #000;
	font-size: 20px;
`;
