import * as React from "react"
import { Text, View, FlatList, SectionList } from "react-native"

const sections = [
	{
		title: "Vegetables",
		key: "vegetables",
		data: [
			{
				key: "vegetables",
				list: [
					{
						name: "Carrot",
						color: "Orange",
					},
					{
						name: "Cabbage",
						color: "Purple",
					},
				],
			},
		],
	},
	{
		title: "Fruits",
		key: "fruits",
		data: [
			{
				key: 'fruits',
				list: [
					{
						name: "Apple",
						color: "Green",
					},
					{
						name: "Banana",
						color: "Yellow",
					},
					{
						name: "Strawberry",
						color: "Red",
					},
					{
						name: "Blueberry",
						color: "Blue",
					},
				],
			},
		],
	},
]

export class MultiColumnExample extends React.Component<{}, {}> {
	renderSection = ({ item }) => {
		return (
			<FlatList
				data={item.list}
				numColumns={3}
				renderItem={this.renderListItem}
				keyExtractor={this.keyExtractor}
			/>
		)
	}

	renderSectionHeader = ({ section }) => {
		return <Text>{section.title}</Text>
	}

	renderListItem = ({ item }) => {
		return (
			<View style={{height: 50, width: 300, borderColor: "green", borderWidth: 1 }}>
				<Text>{item.name}</Text>
				<Text>{item.color}</Text>
			</View>
		)
	}

	keyExtractor = (item) => {
		return item.name
	}

	render () {
		return (
			<SectionList
				sections={sections}
				renderSectionHeader={this.renderSectionHeader}
				renderItem={this.renderSection}
			/>
		)

	}
}
