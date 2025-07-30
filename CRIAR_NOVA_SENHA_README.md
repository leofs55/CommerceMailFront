# Componente Create New Password

## 📋 Visão Geral

O componente `create-new-password` permite que usuários redefinam suas senhas através de um formulário seguro com validações baseadas no DTO Java `UserResetPasswordRequest`.

## 🚀 Funcionalidades

### ✅ Validações de Senha
- **Mínimo 8 caracteres**
- **Pelo menos 1 letra maiúscula**
- **Pelo menos 1 letra minúscula**
- **Pelo menos 1 número**
- **Pelo menos 1 caractere especial** (`!@#$%^&*()_+={}\[\]|:;"'<>,.?/~``)

### 🎯 Indicador de Força
- **Senha Fraca**: Atende a 1-2 critérios
- **Senha Média**: Atende a 3-4 critérios
- **Senha Forte**: Atende a todos os 5 critérios

### 🔐 Segurança
- **Confirmação de senha** obrigatória
- **Validação em tempo real**
- **Botões para mostrar/ocultar senha**

## 📁 Estrutura de Arquivos

```
src/app/components/public/create-new-password/
├── create-new-password.ts      # Lógica do componente
├── create-new-password.html    # Template HTML
└── create-new-password.css     # Estilos CSS
```

## 🔧 Como Usar

### 1. Rota
```typescript
// Exemplo de URL: /reset-password/123
// Onde 123 é o ID do usuário
```

### 2. Componente
```typescript
@Component({
  selector: 'app-create-new-password-component',
  templateUrl: './create-new-password.html',
  styleUrl: './create-new-password.css'
})
export class CreateNewPassword implements OnInit {
  // ...
}
```

## 🌐 Integração com Backend

### Endpoint
```
POST /api/v1/user/{userId}
```

### DTO Java
```java
public record UserResetPasswordRequest(
    @NotBlank(message = "A senha não pode estar em branco.")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres.")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\\[\\]|:;\"'<>,.?/~`]).{8,}$",
        message = "A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial."
    )
    String password
) {}
```

### Payload de Requisição
```json
{
  "password": "NovaSenha123!"
}
```

### Resposta Esperada
```typescript
// Sucesso (string simples)
"Email enviado com sucesso!"

// Erro (string simples)
"Erro ao enviar o email!!"
```

**Nota**: O backend retorna strings simples, não JSON. Por isso usamos `responseType: 'text'` no Angular.

## 🎨 Interface do Usuário

### Estados do Formulário
1. **Inicial**: Campos vazios, botão desabilitado
2. **Digitando**: Validações em tempo real
3. **Válido**: Botão habilitado
4. **Submetido**: Botão mostra "Senha Redefinida"
5. **Resposta**: Mensagem do servidor exibida

### Elementos Visuais
- **Indicador de força**: Barra colorida (vermelho → amarelo → verde)
- **Mensagens de erro**: Validações específicas
- **Botões de toggle**: Mostrar/ocultar senha
- **Feedback visual**: Estados de loading e sucesso

## 🔄 Fluxo de Funcionamento

1. **Usuário acessa URL** com ID na rota (`/reset-password/123`)
2. **Componente extrai ID** da URL
3. **Usuário digita senha** com validações
4. **Usuário confirma senha** (deve ser igual)
5. **Formulário é submetido** para o backend
6. **Resposta é exibida** na interface
7. **Redirecionamento** para login (se sucesso)

## 🛠️ Configuração

### 1. Adicionar Rota
```typescript
// app.routes.ts
{
  path: 'reset-password/:id',
  component: CreateNewPassword
}
```

### 2. Importar Componente
```typescript
// app.config.ts
import { CreateNewPassword } from './components/public/create-new-password/create-new-password';
```

### 3. Configurar Serviço
```typescript
// user-requisition.ts
resetPasswordWithId(userId: string, resetData: { password: string }): Observable<any>
```

## 🧪 Testes

### Cenários de Teste
- ✅ Senha válida com todos os critérios
- ❌ Senha sem maiúscula
- ❌ Senha sem minúscula
- ❌ Senha sem número
- ❌ Senha sem caractere especial
- ❌ Senha com menos de 8 caracteres
- ❌ Senhas não coincidem
- ❌ ID de usuário inválido

### Validações
- **Frontend**: Validações em tempo real
- **Backend**: Validações do DTO Java
- **Integração**: Comunicação HTTP

## 🎯 Melhorias Futuras

- [ ] Adicionar captcha para segurança
- [ ] Implementar rate limiting
- [ ] Adicionar histórico de senhas
- [ ] Implementar notificação por email
- [ ] Adicionar logs de auditoria

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Documentação do Angular
- Especificações do DTO Java
- Logs do console do navegador
- Logs do backend 