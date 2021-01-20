import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { loadBugs ,addBug, resolveBug , getUnresolvedBugs } from "../bugs";
import configureStore from "../configureStore";

describe("bugSlice", () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });
  
  const bugSlice = () => store.getState().entities.bugs;
  const createState = (...objects) => ({
    entities: {
      bugs:{
        list: [...objects]
      }
    }
  })

  describe('loading bugs', () => {
    describe('if the bug exists on the cache', () => {
      it('should not be fetched from the server again', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{id: 1}])

        await store.dispatch(loadBugs())
        await store.dispatch(loadBugs())

        expect(fakeAxios.history.get.length).toBe(1)
      })
    })
    describe('if the bug does not exists on the cache', () => {
      it('should be fetched from the server and put in the store', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{id: 1}])

        await store.dispatch(loadBugs())

        expect(bugSlice().list).toHaveLength(1)
      })
      
      describe('loading indicator', () => {
        it('should be true while fetching the bug', () => {
          fakeAxios.onGet('/bugs').reply(200, [{id: 1}])
          fakeAxios.onGet('/bugs').reply(() => {
            expect(bugSlice().loading).toBe(true);
            return [200, { id: 1 }]
          })

          store.dispatch(loadBugs())
        })
        it('should be false after bugs are fetched', async () => {
          fakeAxios.onGet('/bugs').reply(200, [{id: 1}])
          await store.dispatch(loadBugs())

          expect(bugSlice().loading).toBe(false)
        })
      })
      
    })
    
  })
  

  it('should mark the bug as resolved if its saved to the server', async () => {
    fakeAxios.onPatch('/bugs/1').reply(200, { id: 1, resolved: true })
    fakeAxios.onPost('/bugs').reply(200, { id: 1 })

    await store.dispatch(addBug({ id: 1, resolved: true}))
    await store.dispatch(resolveBug(1))

    expect(bugSlice().list[0].resolved).toBe(true)
  })

  it('should not mark the bug as resolved if its not saved to the server', async () => {
    fakeAxios.onPost('/bugs').reply(200, { id: 1 })
    fakeAxios.onPatch("/bugs/1").reply(500)

    await store.dispatch(addBug({}))
    await store.dispatch(resolveBug(1))

    expect(bugSlice().list[0].resolved).not.toBe(true)
  })

  it("should add the bug to the store if it saved to the server", async () => {
    // AAA -> Arrange, Act, Assert
    const bug = { description: "a" };
    const savedBug = {
      ...bug,
      id: 1,
    };
    fakeAxios.onPost("/bugs").reply(200, savedBug);

    await store.dispatch(addBug(bug));

    expect(bugSlice().list).toContainEqual(savedBug);
  });
  it("should not add the bug to the store if its not saved to the server", async () => {
    // AAA -> Arrange, Act, Assert
    const bug = { description: "a" };

    fakeAxios.onPost("/bugs").reply(500);

    await store.dispatch(addBug(bug));

    expect(bugSlice().list).toHaveLength(0);
  });
  describe("selectors", () => {
    it("getUnresolvedBugs", () => {
      const state = createState({ id: 1, resolved: true }, { id: 2, resolved: false }, { id: 3, resolved: false });
      
      const result = getUnresolvedBugs(state);
      
      expect(result).toHaveLength(2)
    });
  });
});
