import React, { useState, useContext } from 'react';
import { SafeAreaView, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Picker from '../../components/Picker';

import { Background, Input, SubmitButton, SubmitText } from './styles';

export default function New() {

	const navigation = useNavigation();
	const { user: usuario } = useContext(AuthContext);

	const [ valor, setValor] = useState('');
	const [ tipo, setTipo ] = useState('receita');

	const handleSubmit = () => {
		Keyboard.dismiss();

		if (isNaN(parseFloat(valor)) || tipo === null){
			alert('Preencha todos os campos!');
			return 
		}

		Alert.alert(
			'Confirmando dados',
			`Tipo ${tipo} - Valor: ${parseFloat(valor)}`,
			[
				{
					text: 'Cancelar',
					style: 'cancel'
				},
				{
					text: 'Continuar',
					onPress: () => handleAdd()
				}
			]
		)
	};
	const handleAdd = async () => {
		const uid = usuario.uid;
		
		const key = await firebase.database().ref('historico').child(uid).push().key;
		
		await firebase.database().ref('historico').child(uid).child(key).set({
			tipo,
			valor: parseFloat(valor),
			date: format(new Date(), 'dd/MM/yyyy'),
		});
		
		const user = await firebase.database().ref('users').child(uid);
		await user.once('value').then((snapshot) => {
			debugger;
			let saldo = parseFloat(snapshot.val().saldo);
			tipo === 'despesa' ? saldo -= parseFloat(valor) : saldo += parseFloat(valor);
			
			user.child('saldo').set(saldo);
			
		});
		debugger;
		setValor('');

		//Keyboard.dismiss();
		navigation.navigate('Inicio');
	};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Background>
				<Header />
				<SafeAreaView style={{alignItems: 'center'}}>
					<Input
						placeholder='Valor desejado'
						keyboardType='numeric'
						returnKeyType='next'
						onSubmitEditing={ ()=> Keyboard.dismiss() }
						value={valor}
						onChangeText={ (text) => setValor(text) }
					/>

					<Picker
						onChange={setTipo}
						tipo={tipo}
					/>

					<SubmitButton onPress={handleSubmit}>
						<SubmitText>Registrar</SubmitText>
					</SubmitButton>
				</SafeAreaView>
			</Background>
		</TouchableWithoutFeedback>
	);
}