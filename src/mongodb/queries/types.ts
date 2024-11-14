

/*
turn the following python dataclasses into typescript interfaces
@dataclass
class Users:
    userId: str
    start: int
    email: str
    name: str
    plan: str
    modelFavorites: list
    voiceChats: int
    videoChats: int
    voiceCredits: int
    videoCredits: int
    
@dataclass   
class AIModel:
    modelId: str 
    name: str
    threeJSModel: str
    videoAvatarId: str
    description: str
    imgId: str
    prompt: str
    elevenLabsVoiceId: str
    deepgramVoiceId: str
    tags: list
    start: int
    views: int
    chats: int
    rating: float
    creator: str
    creatorId: str
@dataclass
class Conversation:
    conversationId: str
    userId: str
    modelId: str
    conversation: list
    start: int
    end: int
*/

export interface User {
    userId: string
    start: number
    email: string
    name: string
    plan: string
    modelFavorites: []
    voiceChats: number
    videoChats: number
    voiceCredits: number
    videoCredits: number
}

export interface AIModel {
    modelId: string 
    name: string
    threeJSModel: string
    videoAvatarId: string
    description: string
    imgId: string
    prompt: string
    elevenLabsVoiceId: string
    deepgramVoiceId: string
    tags: []
    start: number
    views: number
    chats: number
    rating: number
    creator: string
    creatorId: string
}

export interface Conversation {
    conversationId: string
    userId: string
    modelName: string
    modelId: string
    conversation: []
    start: number
    end: number
}

