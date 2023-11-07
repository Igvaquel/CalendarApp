/* eslint-disable no-undef */
import { configureStore } from "@reduxjs/toolkit"
import { authSlice } from "../../src/store"
import { initialState, notAuthenticatedState, } from '../fixtures/authStates'
import { act, renderHook, waitFor } from "@testing-library/react"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { Provider } from "react-redux"
import calendarApi from "../../src/api/calendarApi"

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState}
        }
    })
}

describe('Pruebas en useAuthStore', () => { 
    const testUser = { email: 'user@gmail.com', password: '123456', name: 'User'}

    beforeEach( () => {
        localStorage.clear()
    })
    
    test('debe de regresar los valores por defectos', () => { 
      
        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        expect(result.current).toEqual({
            checkAuthToken: expect.any(Function),
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
            status: "checking",
            user: {},
        })
    })

    test('startLogin debe de realizar el login', async() => { 

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startLogin( testUser )
        });

        const { errorMessage, status, user } = result.current;
         expect({ errorMessage, status, user }).toEqual({
             errorMessage: undefined,
             status: 'authenticated',
             user: { name: 'User', uid: '6549ef7b7d987e4c5c23ed8c' }
         });

         expect( localStorage.getItem('token') ).toEqual( expect.any(String) );        
    })

    test('startLogin debe fallar la autenticacion', async() => { 
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startLogin( { email: 'asdasd@gmail.com', password: '1654656'} )
        });
        const { errorMessage, status, user } = result.current;

        expect( localStorage.getItem('token') ).toBe( null);
        expect({ errorMessage, status, user }).toEqual({"errorMessage": "Wrong credentials", "status": "not-authenticated", "user": {}})

        await waitFor( 
            () => expect( result.current.errorMessage ).toBe( undefined )
        )
    })

    test('startRegister debe de crear un usuario', async() => { 
        const newUser = { email: 'prueba@gmail.com', password: '123456', name: 'testUser2'}
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data:{
                ok: true,
                uid: "12356789",
                name: "Test user",
                token: "algun-token"
            }
        })

        await act(async() => {
            await result.current.startRegister( newUser )
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage:undefined,
            status:'authenticated',
            user: { name: "Test user", uid: "12356789",}
        });
        spy.mockRestore();
    })

    test('startRegister debe de fallar la creacion', async() => { 
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startRegister( testUser )
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "A user already exists with this email address",
            status: "not-authenticated",
            user: {},
        });
    })

    test('checkAuthToken debe de fallar si no hay un token', async() => { 
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken(  )
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: "not-authenticated",
            user: {},
        });
    });

    test('checkAuthToken debe de autenticar el usuario si hay un token', async() => { 

        const { data } = await calendarApi.post('/auth', testUser );
        localStorage.setItem('token', data.token );

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken(  )
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: "authenticated",
            user: {
                name: "User",
                uid: "6549ef7b7d987e4c5c23ed8c",
            },
        });
    })
})