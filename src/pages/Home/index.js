import React, { useState, useContext, useEffect } from 'react';
import { ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { format, isBefore } from 'date-fns';

import Icon from 'react-native-vector-icons/MaterialIcons';

import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Historico from '../../components/Historico';
import DatePicker from '../../components/DatePicker';

import { Background, Container, Nome, Saldo, Title, List, Area } from './styles';

export default function Home() {

	const [historico, setHistorico] = useState([]);
	const [saldo, setSaldo] = useState(0);
	const [newDate, setNewDate] = useState(new Date());
	const [loadingSaldo, setLoadingSaldo] = useState(true);
	const [loadingHistorico, setLoadingHistorico] = useState(true);
	const [show, setShow] = useState(false);

	const { user, signOut } = useContext(AuthContext);
	const uid = user?.uid;

	useEffect(() => {
		const loadList = async () =>{
			await firebase.database().ref('users').child(uid).on('value', (snapshot) => {
				setSaldo(snapshot.val().saldo);
				setLoadingSaldo(false);
			});
			await firebase.database()
			.ref('historico')
			.child(uid)
			.orderByChild('date')
			.equalTo(format(newDate, 'dd/MM/yyyy'))
			.limitToLast(10)
			.on('value', (snapshot) => {
				setHistorico([]);
				snapshot.forEach((childItem) => {
					const data = {
						key: childItem.key,
						tipo: childItem.val().tipo,
						valor: childItem.val().valor,
						date: childItem.val().date,
					};

					setHistorico((oldArray) => [...oldArray, data].reverse());
				})
				setLoadingHistorico(false);
			});
		}
		loadList();
	}, [newDate]);
	
	const handleDelete = (item) => {

		const [diaItem, mesItem, anoItem] = item.date.split('/');

		const dataItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);
		
		const [diaHoje, mesHoje, anoHoje] = format(new Date(), 'dd/MM/yyyy').split('/');
		
		const dataHoje = new Date(`${anoHoje}/${mesHoje}/${diaHoje}`);

		if (isBefore(dataItem, dataHoje)){
			alert('Exclusão de registo antigo não permitido!');
			return;
		}
		Alert.alert(
			'Atenção!',
			`Você realmente deseja excluir a ${item.tipo} de valor R$ ${item.valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}?`,
			[
				{
					text: 'Não',
					style: 'cancel',
				},
				{
					text: 'Sim',
					onPress: () => handleDeleteSuccess(item),
				}
			]
		)
	};

	const handleDeleteSuccess = async (item) => {
		await firebase.database().ref('historico').child(uid).child(item.key).remove().then( async()=>{
			let saldoAtual = saldo;
			item.tipo === 'despesa' ? saldoAtual += parseFloat(item.valor) : saldoAtual -= parseFloat(item.valor);
			await firebase.database().ref('users').child(uid).child('saldo').set(saldoAtual);
		}).catch((error) => {
			console.log(error);
		});
	}

	const handleShowPicker = () => {
		setShow(true);
	};

	const handleClose = () => {
		setShow(false);
	};

	const onChange = (date) => {
		setShow(Platform.OS === 'ios');
		setNewDate(date);
	};

	return (
		<Background>
			<Header />
			<Container>
				<Nome>{user?.nome}</Nome>
				{loadingSaldo
					? <ActivityIndicator size={20} color='#fff' />
					: <Saldo>R$ {saldo.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Saldo>
				}
			</Container>
			<Area>
				<TouchableOpacity
					onPress={handleShowPicker}
				>
					<Icon name='event' color='#fff' size={30} />
				</TouchableOpacity>
				<Title>Ultimas movimentações</Title>
			</Area>
			{loadingHistorico
				? <ActivityIndicator size={20} color='#fff' />
				: <List 
					showsVerticalScrollIndicator={false}
					data={historico}
					keyExtractor={(item) => item.key}
					renderItem={({item}) => <Historico data={item} deleteItem={handleDelete}/> }
				/>
			}
			{show 
				? <DatePicker 
					onClose={handleClose}
					date={newDate}
					onChange={onChange}
				/>
				: null
			}
		</Background>
	);
}