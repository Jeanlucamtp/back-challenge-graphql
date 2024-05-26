<template>
  <div class="listaProject">
    <h1>Lista de Projetos</h1>

    <form>
      <label>
        <span>Nome do Projeto</span>
        <input type="text" v-model="novoProjeto.name" placeholder="Nome do Projeto">
      </label>
      <label>
        <span>Email do Projeto</span>
        <input type="email" v-model="novoProjeto.email" placeholder="Email do Projeto">
      </label>
      <label>
        <span>Preço do Projeto</span>
        <input type="number" v-model="novoProjeto.price" placeholder="">
      </label>
      <label>
        <span>ID do Usuário</span>
        <input type="number" v-model="novoProjeto.user.id" placeholder="">
      </label>
      <button @click="adicionarNovoProjeto">Adicionar</button>
    </form>

    <ul class="dadosProject" v-if="items && items.length">
      <li v-for="(item, index) in items" :key="index">
        <p>ID: {{ item.id }}</p>
        <p>Nome: {{ item.name }}</p>
        <p>Email: {{ item.email }}</p>
        <p>Preço: {{ item.price }}</p>
        <p>Dados do Usuário >></p>
        <p>ID do Usuário: {{ item.user?.id }}</p>
        <p>Nome do Usuário: {{ item.user?.name }}</p>
        <p>Email do Usuário: {{ item.user?.email }}</p>
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
  email: string;
}

interface Projeto {
  id: number;
  name: string;
  email?: string;
  price?: number;
  user: Usuario;
}

export default defineComponent({
  name: 'ListarProjetos',
  props: {
    items: {
      type: Array as () => Projeto[],
      required: true
    }
  },
  setup() {
    const novoProjeto = ref<{ name: string; email: string; price: number; user: Usuario; }>({
      name: '',
      price: 0,
      user: { id: 0, name: '', email: '' },
      email: '' 
    });

    const adicionarNovoProjeto = async () => {
      try {
        const response = await axios({
          url: "http://localhost:4000",
          method: "post",
          data: {
            query: `
              mutation ($item: ItemInputProject!) {
                saveProject(item: $item) {
                  id
                  name
                  price
                  email
                  user {
                    id
                    name
                    email
                  }
                }
              }
            `,
            variables: {
              item: {
                name: novoProjeto.value.name,
                price: novoProjeto.value.price,
                email: novoProjeto.value.email,
                user: {
                  id: novoProjeto.value.user.id,
                  name: novoProjeto.value.user.name,
                  email: novoProjeto.value.user.email
                }
              }
            }
          }
        });

        console.log('Projeto adicionado:', response.data);
        window.alert('Projeto adicionado:');

        // Limpa os campos de input após adicionar o projeto
        novoProjeto.value.name = '';
        novoProjeto.value.price = 0;
        novoProjeto.value.user.id = 0;
        novoProjeto.value.user.name = '';
        novoProjeto.value.user.email = '';
        novoProjeto.value.email = '';

      } catch (error) {
        console.error('Erro ao adicionar projeto:', error);
      }
    };

    return {
      novoProjeto,
      adicionarNovoProjeto
    };
  }
});
</script>

<style scoped>
.listaProject {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.listaProject h1 {
  color: wheat;
  font-size: 2vw;
}

.listaProject input {
  color: wheat;
  width: 10vw;
  margin-left: 2vw;
  font-size: 1.2vw;
  border-radius: 0.3vw;
  background-color: #57199e;
  border: solid 0.1vw wheat;
  color: wheat;
}

.listaProject button {
  color: wheat;
  margin-left: 1vw;
  background-color: #561A9E;
  border: 0.2vw solid wheat;
  border-radius: 0.5vw;
  font-size: 1.2vw;
  height: 2vw;
  width: 85%;
  align-self: self-end;
  justify-self: end;
}

.listaProject button:hover {
  transform: scale(1.1);
}

.dadosProject {
  width: 50%;
}

.dadosProject li {
  background: linear-gradient(to right, #57199e, #19599e);
  border: 0.2vw solid wheat;
  border-radius: 1vw;
  width: 100%;
  display: grid;
  grid-template-columns: (1fr);
  justify-content: center;
}

.dadosProject li {
  color: wheat;
  margin-top: 2vw;
  margin-bottom: 2vw;
  font-size: 1.5vw;
}

.dadosProject p {
  margin: 0.5vw;
}

form {
  display: grid;
  grid-template-columns: repeat(3, 2fr);
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
}

label span {
  font-size: 1.2vw;
  color: wheat;
  text-align: center;
}
</style>
