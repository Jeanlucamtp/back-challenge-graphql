<template>
  <div class="listaUser">
    <h1>Lista de Usuários</h1>
    <form>
      <input type="text" v-model="novoUsuario.name" placeholder="Adicionar Nome" required>
      <input type="email" v-model="novoUsuario.email" placeholder="Adicionar Email" required>
      <button type="button" @click="adicionarNovoUsuario">Adicionar</button>
    </form>
    <ul class="dadosUser" v-if="items && items.length">
      <li v-for="(item, index) in items" :key="index">
        <p>ID: {{ item.id }}</p>
        <p>Nome: {{ item.name }}</p>
        <p>Email: {{ item.email }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref } from 'vue';

interface Usuario {
  id: number;
  name: string;
  email?: string;
}

export default defineComponent({
  name: 'ListarUsuarios',
  props: {
    items: {
      type: Array as () => Usuario[],
      required: true
    }
  },
  setup() {
    const novoUsuario = ref<{ name: string; email: string }>({ name: '', email: '' });

    const adicionarNovoUsuario = async () => {
      try {
        const response = await axios({
          url: "http://localhost:4000",
          method: "post",
          data: {
            query: `
              mutation ($item: ItemInput!) {
                saveUser(item: $item) {
                  id
                  name
                  email
                }
              }
            `,
            variables: {
              item: {
                name: novoUsuario.value.name,
                email: novoUsuario.value.email
              }
            }
          }
        });

        console.log('Usuário adicionado:', response.data);
        window.alert('Usuário adicionado!');

        // Limpa os campos de input após adicionar o usuário
        novoUsuario.value.name = '';
        novoUsuario.value.email = '';

      } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
      }
    };

    return {
      novoUsuario,
      adicionarNovoUsuario
    };
  }
});
</script>

<style scoped>

.listaUser{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.listaUser h1{
  color: wheat;
  font-size: 2vw;
}

.listaUser input{
  color: wheat;
  width: 10vw;
  margin-left: 2vw;
  font-size: 1.2vw;
  border-radius: 0.3vw;
  background-color: #57199e;
  border: solid 0.1vw wheat;
  color: wheat;
}

.listaUser button{
  color: wheat;
  margin-left: 1vw;
  background-color: #561A9E;
  border: 0.2vw solid wheat;
  border-radius: 0.5vw;
  font-size: 1.2vw;
}

.listaUser button:hover{
  transform: scale(1.1);
}

.dadosUser{
  width: 50%;
}

.dadosUser li{
  background: linear-gradient(to right, #57199e, #19599e);
  border: 0.2vw solid wheat;
  border-radius: 1vw;
  width: 100%;
  display: grid;
  grid-template-columns: (1fr);
  justify-content: center;
}

.dadosUser li{
  color: wheat;
  margin-top: 2vw;
  margin-bottom: 2vw;
  font-size: 1.5vw;
}

.dadosUser p{
  margin: 0.5vw;
}
</style>
