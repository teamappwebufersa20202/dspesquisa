import React, { useState, useEffect } from 'react'
import { FontAwesome5 as Icon } from '@expo/vector-icons'
import { Text, StyleSheet, View, Alert } from 'react-native'
import { RectButton, TextInput } from 'react-native-gesture-handler'
import Header from '../../components/Header'
import PlatformCard from './PlatformCard'
import { Game, GamePlatform } from './types'
import RNPickerSelect from 'react-native-picker-select'
import axios from 'axios'

const BASE_URL = 'https://sds1-cesario.herokuapp.com'

const placeholder = {
  label: 'Selecione o game',
  value: null
}

const mapSelectValues = (games: Game[]) => {
  return games.map(game => ({
    ...game,
    label: game.title,
    value: game.id
  }))
}

const CreateRecord = () => {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [platform, setPlatform] = useState<GamePlatform>()
  const [selectedGame, setSelectedGame] = useState('')
  const [allGames, setAllGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])

  const handleChangePlatform = (selectPlatform: GamePlatform) => {
    setPlatform(selectPlatform)
    const gamesByPlatform = allGames.filter(
      game => game.platform === selectPlatform
    )
    setFilteredGames(gamesByPlatform)
  }
  const handleSubmit = () => {
    const payload = { name, age, gameId: selectedGame }

    axios.post(`${BASE_URL}/records`, payload).then(() => {
      Alert.alert('Dados Salvos com Sucesso!')
      setName('')
      setAge('')
      setSelectedGame('')
      setPlatform(undefined)
    }).catch(() => Alert.alert('Erro ao Salvar informações'))
  }

  useEffect(() => {
    axios.get(`${BASE_URL}/games`)
      .then(response => {
        const selectValue = mapSelectValues(response.data)
        setAllGames(selectValue)
      }).catch(() => Alert.alert('Erro ao listar os jogos'))
  }, [])

  return (
    <>
      <Header />
      <View style={styles.container}>
        <TextInput
          onChangeText={text => setName(text)}
          style={styles.inputText}
          placeholder="Nome"
          placeholderTextColor="#9E9E9E"
          value={name}
        />
        <TextInput
          onChangeText={text => setAge(text)}
          maxLength={3}
          keyboardType="numeric"
          style={styles.inputText}
          placeholder="Idade"
          placeholderTextColor="#9E9E9E"
          value={age} />
        <View style={styles.platformContainer}>
          <PlatformCard icon="laptop" onChange={handleChangePlatform} platform="PC" activePlatform={platform} />
          <PlatformCard icon="xbox" onChange={handleChangePlatform} platform="XBOX" activePlatform={platform} />
          <PlatformCard icon="playstation" onChange={handleChangePlatform} platform="PLAYSTATION" activePlatform={platform} />
        </View>
        <RNPickerSelect
          value={selectedGame}
          onValueChange={value => setSelectedGame(value)}
          placeholder={placeholder}
          items={filteredGames}
          style={pickerSelectStyles}
          Icon={() => {
            return <Icon name="chevron-down" color="#9E9E9E" size={25} />
          }}
        />
        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              SALVAR
            </Text>
          </RectButton>
        </View>
      </View>
    </>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    color: '#ED7947',
    paddingRight: 30,
    fontFamily: "Play_700Bold",
    height: 50
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    color: '#ED7947',
    paddingRight: 30,
    fontFamily: "Play_700Bold",
    height: 50
  },
  placeholder: {
    color: '#9E9E9E',
    fontSize: 16,
    fontFamily: "Play_700Bold",
  },
  iconContainer: {
    top: 10,
    right: 12,
  }
})

const styles = StyleSheet.create({
  container: {
    marginTop: '15%',
    paddingRight: '5%',
    paddingLeft: '5%',
    paddingBottom: 50
  },
  inputText: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    color: '#ED7947',
    fontFamily: "Play_700Bold",
    fontSize: 16,
    paddingLeft: 20,
    marginBottom: 21
  },
  platformContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    marginTop: '15%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00D4FF',
    flexDirection: 'row',
    borderRadius: 10,
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontFamily: "Play_700Bold",
    fontWeight: 'bold',
    fontSize: 18,
    color: '#0B1F34',
  }
})
export default CreateRecord