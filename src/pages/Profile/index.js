import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Container, Nome, NewLink, NewText, Logout, LogoutText } from './styles';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';

export default function Profile() {
	const navigation = useNavigation();

	const { user, signOut } = useContext(AuthContext);

	return (
		<Container>
			<Header />
			<Nome>{user?.nome}</Nome>
			<NewLink onPress={() => {navigation.navigate('Registrar')}}>
				<NewText>Registrar gastos</NewText>
			</NewLink>
			<Logout onPress={() => signOut()}>
				<LogoutText>Sair</LogoutText>
			</Logout>
		</Container>
	);
}