/*
 * @Author: Tendercfj 1805150751@qq.com
 * @Date: 2026-05-07 15:46:15
 * @LastEditors: Tendercfj 1805150751@qq.com
 * @LastEditTime: 2026-05-07 16:06:53
 * @FilePath: /next-resume/app/page.tsx
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
// File: app/page.tsx
import { neon } from '@neondatabase/serverless';

export default function Page() {
  async function create(formData: FormData) {
    'use server';
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get('comment');
    if (typeof comment !== 'string') {
      return;
    }
    // Insert the comment from the form into the Postgres database
    await sql.query('INSERT INTO comments (comment) VALUES ($1)', [comment]);
  }

  return (
    <form action={create}>
      <input type="text" placeholder="write a comment" name="comment" />
      <button type="submit">Submit</button>
    </form>
  );
}
