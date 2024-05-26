<template>
  <div class="main">

    <div>
      <h1 class="titulo">Api BackEnd</h1>
    </div>

    <div class="editor">

      <div class="opcoes">
        <button @click="listarUsers">Listar/Adicionar <br>Usuarios</button>
        <button @click="listarProjects">Listar/Adicionar <br>Projetos</button>
      </div>

      <Listar v-if="tipoListagem === 'users'" :items="dadosListagem"></Listar>

      <ListarProjetos v-else-if="tipoListagem === 'projects'" :items="dadosListagem"></ListarProjetos>

    </div>

  </div>

</template>

<script lang="ts">
import Listar from './components/Listar.vue';
import ListarProjetos from './components/ListarProjetos.vue';
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'App',
  components: {
    Listar,
    ListarProjetos
  },
  data() {
    return {
      dadosListagem: [] as { id: number, name: string, email?: string, description?: string, price?: number, type: string }[],
      tipoListagem: '' 
    };
  },
  methods: {
    async listarUsers() {
      try {
        const response = await axios.post('http://localhost:4000', {
          query: `
            {
              users {
                id
                name
                email
              }
            }
          `
        });
        this.dadosListagem = response.data.data.users.map((user: { id: number, name: string, email: string }) => ({
          ...user,
          type: 'users'
        }));
        this.tipoListagem = 'users'; // Definindo o tipoListagem para users
      } catch (error) {
        console.error('Erro ao listar usuários:', error);
      }
    },
    async listarProjects() {
      try {
        const response = await axios.post('http://localhost:4000', {
          query: `
            {
              projects {
                id
                name
                email
                price
                user {
                  id
                  name
                  email
                }
              }
            }
          `
        });
        this.dadosListagem = response.data.data.projects.map((project: { id: number, name: string, price: number, user: { id: number, name: string, email: string } }) => ({
          ...project,
          type: 'projects'
        }));
        this.tipoListagem = 'projects'; // Definindo o tipoListagem para projects
      } catch (error) {
        console.error('Erro ao listar projetos:', error);
      }
    }
  }
});
</script>

<style scoped>

.main{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titulo {
  text-align: center;
  color: wheat;
  font-weight: bold;
  font-size: 3vw;
}

.editor {
  background: linear-gradient(to right, #57199e, #19599e, #57199e);
  width: 70%;
  min-height: 100vh;
  border: 0.2vw solid wheat;
  border-radius: 1vw;
}

.opcoes {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2vw;
}

.opcoes button {
  cursor: pointer;
  border-radius: 0.5vw;
  border: solid 0.2vw wheat;
  background: linear-gradient(to right, #57199e, #19599e);
  margin-top: 2vw;
  color: rgb(255, 255, 255);
  font-weight: bold;
  font-size: 1.2vw;
}

.opcoes button:hover {
  transform: scale(1.1);
}
</style>
