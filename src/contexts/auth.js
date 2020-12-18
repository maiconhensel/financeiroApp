import React, { createContext, useState, useEffect } from 'react';

import firebase from '../services/firebaseConnection';

import AsyncStorage from '@react-native-community/async-storage';

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {

	const [ user, setUser ] = useState(null);
	const [ loading, setLoading ] = useState(true);
	const [ loadingAuth, setLoadingAuth ] = useState(false);

	useEffect(() => {
		const loadStorage = async () => {
			const storageUser = await AsyncStorage.getItem('Auth_user');
			if (storageUser){
				setUser(JSON.parse(storageUser));
			}
			setLoading(false);
		}
		loadStorage();
	}, []);

	//Cadastrar usuário
	const signUp = async (email, password, nome) => {
		setLoadingAuth(true);
		await firebase.auth().createUserWithEmailAndPassword(email, password).then(
			async(value) =>{
				const uid = value.user.uid;
				await firebase.database().ref('users').child(uid).set({
					nome,
					saldo: 0
				}).then(() => {
					const data = { uid, nome, email };
					setLoadingAuth(false);
					storageUser(data);
					setUser(data);
				});
			}
		).catch((error) => {
			setLoadingAuth(false);
			if (error.code === 'auth/weak-password'){
				alert('Senha deve conter no mínimo 6 caracteres');
			}else if (error.code === 'auth/invalid-email'){
				alert('Email inválido');
			}else{
				alert('Ops! Algo deu errado...')
			}
		})
	}

	const signIn = async (email, password) => {
		setLoadingAuth(true);
		await firebase.auth().signInWithEmailAndPassword(email, password).then(
			async(value) => {
				const uid = value.user.uid;
				await firebase.database().ref('users').child(uid).once('value').then(
					(snapshot) => {
						const data = { uid, nome: snapshot.val().nome, email: snapshot.val().email };
						setLoadingAuth(false);
						storageUser(data);
						setUser(data);
					}
				);
			}
		).catch((error) => {
			setLoadingAuth(false);
			alert(error.code);
		});

	};

	const storageUser = async (data) => {
		await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
	}

	const signOut = async () => {
		await firebase.auth().signOut();
		await AsyncStorage.clear().then(()=> { setUser(null); });
	}


	return (
		<AuthContext.Provider value={{signed: !!user, user, signUp, signIn, loading, signOut, loadingAuth}}>
			{children}
		</AuthContext.Provider>
	);
}