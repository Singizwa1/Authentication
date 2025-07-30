import supertest,{Request,Response} from 'supertest'
import {it,describe,expect,jest,beforeAll,afterAll,afterEach} from '@jest/globals'

import {app} from '../server'

import { Sequelize } from 'sequelize'

import databaseConfig from '../config/config'


const request=supertest(app)

const userResponse={
    token:''
}
export const prefix='api/v1/'
let sequelize:any;

beforeAll(async ()=>{
    try{
    const db_config=databaseConfig as any 
    sequelize=new Sequelize({
        ...db_config,
        dialect:'postgres',
    })
    await sequelize.authenticate()
    console.log("Tested connected successful")
    }
catch(error){
    console.error("database failed to connect");
    throw error

}

},1000)

afterEach(() => {
    jest.clearAllMocks()
})
afterAll(async () => {
    jest.clearAllMocks()
    if (sequelize) {
        await sequelize.close()
    }
})
describe('Login with admin token', () => {
    it('Login Succefully', async () => {
        const res = await request.post(`${prefix}login`).send({
            email: 'admin@admin.com',
            password: 'password'
        })
        userResponse.token = res.body.data
        expect(res.body.message).toEqual('User logged in successfully')
        expect(res.body.success).toBe(true)
    })
    it('users Doesnt exist', async () => {
        const res = await request.post(`${prefix}login`).send({
            email: 'admin2@admin.com',
            password: 'password'
        })
        expect(res.body.message).toEqual("User doesn't exist, please sign up")
        expect(res.status).toBe(404)
    })
    it('invalid Password', async () => {
        const res = await request.post(`${prefix}login`).send({
            email: 'admin@admin.com',
            password: 'passworrd'
        })
        expect(res.body.message).toEqual("Invalid email or password")
        expect(res.status).toBe(401)
    })



})