import { signIn, signOut } from '@/lib/auth';

export default function Home() {
  return (
    <div>
      <form
        action={async () => {
          'use server';
          await signIn('google');
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>

      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <button type="submit">Signout</button>
      </form>
    </div>
  );
}
