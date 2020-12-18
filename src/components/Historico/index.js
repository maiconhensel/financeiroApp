import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Container, Tipo, IconView, TipoText, ValorText } from './styles';

export default function Historico({ data, deleteItem }) {
 return (
	 <TouchableWithoutFeedback onLongPress={()=> deleteItem(data) }>
		<Container>
			<Tipo>
				<IconView tipo={data.tipo}>
					<Icon
						name={data.tipo === 'despesa' ? 'arrow-down' : 'arrow-up'}
						color='#fff'
						size={20} 
					/>
					<TipoText>{data.tipo}</TipoText>
				</IconView>
			</Tipo>
			<ValorText>R$ {data.valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</ValorText>
		</Container>
	</TouchableWithoutFeedback>
  );
}