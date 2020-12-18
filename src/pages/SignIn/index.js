import React, { useState, useContext } from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';

import { Backgroud, Container, Logo, AreaInput, Input, SubmitButton, SubmitText, Link, LinkText } from './styles';

export default function SignIn() {

	const navigation = useNavigation();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { signIn, loadingAuth } = useContext(AuthContext);

	function handelLogin(){
		signIn(email, password);
	}

	return (
		<Backgroud>
			<Container
				behavior={Platform.OS == 'ios' ? 'padding' : ''}
				enabled
			>
				<Logo source={require('../../assets/Logo.png')}/>
				<AreaInput>
					<Input 
						placeholder='Email'
						autoCorrect={false}
						autoCapitalize='none'
						value={email}
						onChangeText={(text) => setEmail(text)}
					/>
				</AreaInput>
				<AreaInput>
					<Input 
						placeholder='Senha'
						autoCorrect={false}
						autoCapitalize='none'
						value={password}
						onChangeText={(text) => setPassword(text)}
						secureTextEntry={true}
					/>
				</AreaInput>
				<SubmitButton onPress={handelLogin}>
					{loadingAuth 
						? <ActivityIndicator size={20} color='#fff' />
						: <SubmitText>Logar</SubmitText>
					}
				</SubmitButton>

				<Link
					onPress={()=> {
						setEmail('');
						setPassword('');
						navigation.navigate('SignUp');
					}
				}>
					<LinkText>Criar conta</LinkText>
				</Link>


			</Container>
		</Backgroud>
	);
}