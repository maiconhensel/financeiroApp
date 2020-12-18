import React, { useState } from 'react';
import { Text, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Container, Header } from './styles';

export default function DatePicker({date, onClose, onChange}) {

	const [dataNow, setDataNow ] = useState(new Date(date));

	return (
		<Container>
			{Platform.OS == 'ios'
				? <Header>
					<TouchableOpacity onPress={onClose}>
						<Text>Fechar</Text>
					</TouchableOpacity>
				</Header>
				: null
			}
			<DateTimePicker 
				value={dataNow}
				mode='date'
				display='default'
				onChange={(e, d)=>{
					const currentDate = d || dataNow;
					setDataNow(currentDate);
					onChange(currentDate);
				}}
				style={{
					backgroundColor: '#fff',
				}}
			/>
		</Container>
	);
}