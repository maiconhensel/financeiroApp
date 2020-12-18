
import React from 'react';
import { Picker as PickerSelect}  from '@react-native-picker/picker';

import { PickerView } from './styles';

export default function Picker({ onChange, tipo }) {
	return (
		<PickerView>
			<PickerSelect
				style={{
					width: '100%',
				}}
				selectedValue={tipo}
				onValueChange={(valor) => onChange(valor) }
			>
				<PickerSelect.Item label='Receita' value='receita' />
				<PickerSelect.Item label='Despesa' value='despesa' />
			</PickerSelect> 

		</PickerView>
	);
}