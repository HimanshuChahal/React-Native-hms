import { useState, useEffect } from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { HMSUpdateListenerActions, HMSConfig, HMSVideoViewMode } from "@100mslive/react-native-hms"
import { FontAwesome } from '@expo/vector-icons'
import uuid from 'react-native-uuid'

export default ({ navigation, route }) => {

    const [ joined, setJoined ] = useState(true)

    const [ mic, setMic ] = useState(true)

    const [ trackId, setTrackId ] = useState(undefined)

    const [ message, setMessage ] = useState('No message')

    const instance = route.params.instance

    const HMSView = instance.HmsView

    const onPeerListener = (value) => {
        
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

        instance.addEventListener(HMSUpdateListenerActions.ON_ROOM_UPDATE, (value) => {

            console.log('Room update listener callback')

        })

        instance.addEventListener(HMSUpdateListenerActions.ON_TRACK_UPDATE, (value) => {
            console.log('Track update listener callback')

            instance.remotePeers = value.remotePeers

            console.log(value.remotePeers[0].videoTrack)

            setTrackId(value.remotePeers[0].videoTrack.trackId)
        })

        instance.addEventListener(HMSUpdateListenerActions.ON_MESSAGE, (message) => {

            console.log('Messages')

            console.log(message)

            setMessage('Message added')

        })
    
        const hmsConfig = new HMSConfig({ username: 'user', authToken: token })

        console.log('Called before join')
    
        instance.join(hmsConfig)
    
    }
    
    useEffect(() => {
    
        joinRoom()
    
    }, [])

    return (
        joined ? (
                <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                    { trackId && <HMSView style = {{ width: '100%', height: '100%' }} scaleType = { HMSVideoViewMode.ASPECT_FILL } trackId = { trackId } mirror = { true } sink = { true }/> }

                    <TouchableOpacity style = {{ position: 'absolute', alignSelf: 'center', width: 40, height: 40, bottom: 60, paddingVertical: 10, alignItems: 'center', backgroundColor: 'red', borderRadius: 30 }}
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
                                <FontAwesome name = 'microphone-slash' size = { 20 } color = 'white'/>
                            ) : (
                                <FontAwesome name = 'microphone' size = { 20 } color = 'white'/>
                            )
                        }

                    </TouchableOpacity>

                    <TouchableOpacity style = {{ position: 'absolute', bottom: 20, padding: 10, backgroundColor: 'red', borderRadius: 30, marginTop: 20 }}
                    onPress = {() => {
                        instance.leave()
                        navigation.pop()
                    }}>

                        <Text style = {{ color: 'white' }}>Leave</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style = {{ position: 'absolute', top: 20, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, backgroundColor: 'black' }}
                    onPress = {() => {
                        instance.sendBroadcastMessage('Message sent')
                    }}>

                        <Text style = {{ color: 'white' }}>Message</Text>

                    </TouchableOpacity>

                    <Text style = {{ position: 'absolute', top: 50, color: 'red' }}>{ message }</Text>

                </View>
            ) : (
                <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                    <Text>Joining.....</Text>

                </View>)
    )

}
