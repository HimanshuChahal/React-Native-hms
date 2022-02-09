import { useState, useEffect } from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { HMSUpdateListenerActions, HMSConfig, HMSVideoViewMode } from "@100mslive/react-native-hms"
import { FontAwesome } from '@expo/vector-icons'
import uuid from 'react-native-uuid'

export default ({ navigation, route }) => {

    const [ joined, setJoined ] = useState(false)

    const [ mic, setMic ] = useState(true)

    const instance = route.params.instance

    const HMSView = instance.HmsView

    const onPeerListener = ({
        room,
        type,
        remotePeers,
        localPeer,
        peer,
    }) => {
        
        console.log('On peer update listener callback')
    
    };
    
    const joinRoom = async () => {
    
        const response = await fetch(`https://prod-in.100ms.live/hmsapi/hyperfit.app.100ms.live/api/token`, {
            method: 'POST',
            body: JSON.stringify({
                user_id: `${ uuid.v4() }`,
                room_id: '61e6999ca8fdf1a00ecc9ab3',
                role: 'trainer'
            }),
        })
        const { token } = await response.json()

        console.log(token)

        instance.addEventListener(HMSUpdateListenerActions.ON_JOIN, () => {
            console.log('On join listener callback')
            console.log(instance.remotePeers)
            setJoined(true)
        })
    
        instance.addEventListener(HMSUpdateListenerActions.ON_ERROR, () => {
            console.log('On error listener callback')
        })
    
        instance.addEventListener(HMSUpdateListenerActions.ON_PEER_UPDATE, onPeerListener)

        instance.addEventListener(HMSUpdateListenerActions.ON_ROOM_UPDATE, (room, type, localPeer, remotePeers) => {

            console.log('Room update listener callback')

        })
    
        const hmsConfig = new HMSConfig({ username: 'user', authToken: token })
    
        instance.join(hmsConfig)
    
    }
    
    useEffect(() => {
    
        joinRoom()
    
    }, [])

    return (
        joined ? (
                <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                    <HMSView style = {{ width: '80%', height: 300 }} scaleType = { HMSVideoViewMode.ASPECT_FILL } trackId = { '8e964fdd-80ba-4047-9125-e8339bd13dd2' } mirror = { true } sink = { true }/>

                    <TouchableOpacity style = {{ padding: 10, backgroundColor: 'red', borderRadius: 30 }}
                    onPress = {() => {

                        if(!instance.localPeer)
                        {
                            return
                        }

                        instance.localPeer.localAudioTrack().setMute(!mic)
                        setMic(!mic)
                    }}>

                        {
                            mic ? (
                                <FontAwesome name = 'microphone-slash'/>
                            ) : (
                                <FontAwesome name = 'microphone'/>
                            )
                        }

                    </TouchableOpacity>

                    <TouchableOpacity style = {{ padding: 10, backgroundColor: 'red', borderRadius: 30, marginTop: 20 }}
                    onPress = {() => {
                        instance.leave()
                        navigation.pop()
                    }}>

                        <Text>Leave</Text>

                    </TouchableOpacity>

                </View>
            ) : (
                <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                    <Text>Joining.....</Text>

                </View>)
    )

}
